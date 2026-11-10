import { ticketItems, tickets } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const ticketRelations = {
    trace: true,
    items: {
        with: {
            product: true,
        },
    },
};

export function listByTraceId(traceId, withRelations = false) {
    const db = getDb();
    return db.query.tickets.findMany({
        where: (ticket, { eq }) => eq(ticket.traceId, traceId),
        with: withRelations ? ticketRelations : undefined,
    });
}

export function findById(id, withRelations = false) {
    const db = getDb();
    return db.query.tickets.findFirst({
        where: (ticket, { eq }) => eq(ticket.id, id),
        with: withRelations ? ticketRelations : undefined,
    });
}

export function createSale(traceId, items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("No se puede crear un ticket sin ticketItems.");
    }

    const db = getDb();
    return db.transaction((tx) => {
        const ticket = tx.insert(tickets)
            .values({
                traceId,
                total: 0,
                isClosed: 1,
            })
            .returning()
            .get();

        const createdItems = tx.insert(ticketItems)
            .values(items.map((item) => ({
                ticketId: ticket.id,
                productId: item.productId,
                amount: item.amount,
                unitPrice: item.unitPrice,
                subTotal: item.subTotal,
                transactionCurrency: item.transactionCurrency,
            })))
            .returning()
            .all();

        return {
            ...ticket,
            items: createdItems,
        };
    });
}
