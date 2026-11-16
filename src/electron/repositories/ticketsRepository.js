import { and, desc, eq, gte, sql } from "drizzle-orm";
import { products, ticketItems, tickets, traces } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const ticketRelations = {
    trace: true,
    items: {
        with: {
            product: true,
        },
    },
};

function getOpenTrace(tx) {
    const date = new Date().toLocaleDateString("sv-SE");
    const trace = tx.select().from(traces)
        .where(eq(traces.date, date))
        .orderBy(desc(traces.createdAt))
        .all()
        .find((entry) => !entry.isClosed);
    return trace ?? tx.insert(traces).values({ date }).returning().get();
}

function addTraceTotals(tx, trace, { sells = 0, refunds = 0, total = {} }) {
    const nextTotal = { ...trace.total };
    for (const [currency, value] of Object.entries(total)) {
        nextTotal[currency] = (Number(nextTotal[currency]) || 0) + value;
    }
    tx.update(traces).set({
        sells: trace.sells + sells,
        refunds: trace.refunds + refunds,
        total: nextTotal,
    }).where(eq(traces.id, trace.id)).run();
}

export function listAll() {
    return getDb().query.tickets.findMany({
        where: (ticket, { eq: equals }) => equals(ticket.archived, false),
        with: ticketRelations,
        orderBy: { createdAt: "desc" },
    });
}

export function listByTraceId(traceId, withRelations = false) {
    return getDb().query.tickets.findMany({
        where: (ticket, { and: all, eq: equals }) => all(
            equals(ticket.traceId, traceId),
            equals(ticket.archived, false),
        ),
        with: withRelations ? ticketRelations : undefined,
        orderBy: { createdAt: "desc" },
    });
}

export function findById(id, withRelations = false) {
    return getDb().query.tickets.findFirst({
        where: (ticket, { eq: equals }) => equals(ticket.id, id),
        with: withRelations ? ticketRelations : undefined,
    });
}

export function createSale(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("No se puede crear un ticket sin ticketItems.");
    }

    return getDb().transaction((tx) => {
        const trace = getOpenTrace(tx);
        const currencyTotals = {};
        let amountSold = 0;

        const normalizedItems = items.map((item) => {
            const amount = Number(item.amount);
            const unitPrice = Number(item.unitPrice);
            const subTotal = Number(item.subTotal ?? unitPrice * amount);
            if (!Number.isInteger(amount) || amount <= 0 || !Number.isFinite(unitPrice) || !Number.isFinite(subTotal)) {
                throw new Error("TicketItem de venta inválido.");
            }
            if (!item.transactionCurrency) throw new Error("Cada TicketItem debe especificar su moneda.");

            const updated = tx.update(products)
                .set({ stock: sql`${products.stock} - ${amount}` })
                .where(and(eq(products.id, item.productId), gte(products.stock, amount)))
                .returning({ id: products.id })
                .get();
            if (!updated) throw new Error(`Stock insuficiente para el producto ${item.productId}.`);

            currencyTotals[item.transactionCurrency] = (currencyTotals[item.transactionCurrency] ?? 0) + subTotal;
            amountSold += amount;
            return { ...item, amount, unitPrice, subTotal };
        });

        const ticket = tx.insert(tickets).values({
            traceId: trace.id,
            total: Object.values(currencyTotals).reduce((sum, value) => sum + value, 0),
            kind: "sale",
            isClosed: 1,
        }).returning().get();
        const createdItems = normalizedItems.map((item) => tx.insert(ticketItems).values({
            ticketId: ticket.id,
            productId: item.productId,
            amount: item.amount,
            unitPrice: item.unitPrice,
            subTotal: item.subTotal,
            transactionCurrency: item.transactionCurrency,
        }).returning().get());

        addTraceTotals(tx, trace, { sells: amountSold, total: currencyTotals });
        return { ...ticket, items: createdItems };
    });
}

export function createRefund(productId, amount) {
    const quantity = Number(amount);
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("La cantidad de la devolución debe ser un entero positivo.");
    }

    return getDb().transaction((tx) => {
        const product = tx.select().from(products)
            .where(eq(products.id, productId))
            .get();
        if (!product) throw new Error(`No se encontró el producto ${productId}.`);

        const trace = getOpenTrace(tx);
        const saleItems = tx.select({
            id: ticketItems.id,
            ticketId: ticketItems.ticketId,
            amount: ticketItems.amount,
            unitPrice: ticketItems.unitPrice,
            transactionCurrency: ticketItems.transactionCurrency,
        }).from(ticketItems)
            .innerJoin(tickets, eq(ticketItems.ticketId, tickets.id))
            .where(and(
                eq(ticketItems.productId, productId),
                eq(tickets.kind, "sale"),
            ))
            .orderBy(ticketItems.id)
            .all();
        const sold = saleItems.reduce((sum, item) => sum + item.amount, 0);
        const previousRefunds = tx.select({
            id: ticketItems.id,
            originalTicketItemId: ticketItems.originalTicketItemId,
            amount: ticketItems.amount,
            ticketId: ticketItems.ticketId,
        }).from(ticketItems)
            .innerJoin(tickets, eq(ticketItems.ticketId, tickets.id))
            .where(and(
                eq(ticketItems.productId, productId),
                eq(tickets.kind, "refund"),
            ))
            .orderBy(ticketItems.id)
            .all();
        const refunded = previousRefunds.reduce((sum, item) => sum + item.amount, 0);
        if (refunded + quantity > sold) {
            throw new Error("La cantidad de devolución supera la cantidad vendida.");
        }

        const refundedBySaleItem = new Map();
        for (const refund of previousRefunds) {
            if (refund.originalTicketItemId == null) continue;
            refundedBySaleItem.set(
                refund.originalTicketItemId,
                (refundedBySaleItem.get(refund.originalTicketItemId) ?? 0) + refund.amount,
            );
        }

        let unlinkedRefunds = previousRefunds
            .filter((refund) => refund.originalTicketItemId == null)
            .reduce((sum, refund) => sum + refund.amount, 0);
        for (const sale of saleItems) {
            if (unlinkedRefunds === 0) break;
            const alreadyLinked = refundedBySaleItem.get(sale.id) ?? 0;
            const amount = Math.min(sale.amount - alreadyLinked, unlinkedRefunds);
            refundedBySaleItem.set(sale.id, alreadyLinked + amount);
            unlinkedRefunds -= amount;
        }

        const refundPlan = [];
        let remaining = quantity;
        for (const sale of saleItems) {
            if (remaining === 0) break;
            const refundedFromSale = refundedBySaleItem.get(sale.id) ?? 0;
            const available = sale.amount - refundedFromSale;
            const amount = Math.min(available, remaining);
            if (amount > 0) {
                refundPlan.push({ saleItem: sale, amount });
                remaining -= amount;
            }
        }

        const refundTotals = {};
        for (const { saleItem, amount: refundAmount } of refundPlan) {
            refundTotals[saleItem.transactionCurrency] =
                (refundTotals[saleItem.transactionCurrency] ?? 0) + saleItem.unitPrice * refundAmount;
        }
        const ticket = tx.insert(tickets).values({
            traceId: trace.id,
            total: Object.values(refundTotals).reduce((sum, value) => sum + value, 0),
            kind: "refund",
            isClosed: 1,
        }).returning().get();
        const items = refundPlan.map(({ saleItem, amount: refundAmount }) => tx.insert(ticketItems).values({
            ticketId: ticket.id,
            productId,
            amount: refundAmount,
            unitPrice: saleItem.unitPrice,
            subTotal: saleItem.unitPrice * refundAmount,
            transactionCurrency: saleItem.transactionCurrency,
            originalTicketItemId: saleItem.id,
        }).returning().get());

        const updated = tx.update(products)
            .set({ stock: sql`${products.stock} + ${quantity}` })
            .where(eq(products.id, productId))
            .returning({ id: products.id })
            .get();
        if (!updated) throw new Error(`No se pudo actualizar el stock del producto ${productId}.`);
        addTraceTotals(tx, trace, {
            refunds: quantity,
            total: Object.fromEntries(
                Object.entries(refundTotals).map(([currency, value]) => [currency, -value]),
            ),
        });
        return { ...ticket, items };
    });
}

export function archiveAll() {
    return getDb().update(tickets).set({ archived: true })
        .where(eq(tickets.archived, false))
        .returning()
        .all();
}
