import { create } from "zustand";
import * as ticketsFacade from "../facades/tickets-facade";
import useTraceStore from "./traceStore";

function present(ticket) {
    const total = {};
    const products = (ticket.items ?? []).map((item) => {
        const currency = item.transactionCurrency;
        total[currency] = (total[currency] ?? 0) + Number(item.subTotal);
        return {
            name: item.product?.name ?? `Producto ${item.productId}`,
            price: item.unitPrice,
            amount: item.amount,
        };
    });
    const isRefund = ticket.kind === "refund";
    return {
        ...ticket,
        type: isRefund ? "Devolución" : "Venta",
        product: isRefund ? products[0]?.name : undefined,
        products,
        productsAmount: products.reduce((sum, item) => sum + item.amount, 0),
        total,
        date: new Date(ticket.createdAt).toDateString(),
    };
}

const useTicketStore = create((set, get) => ({
    ticketData: [],

    loadData: async () => {
        const rows = await ticketsFacade.listAll();
        set({ ticketData: rows.map(present) });
    },

    addSale: async (cartItems) => {
        const items = cartItems.map((item) => ({
            productId: item.id,
            amount: Number(item.cart),
            unitPrice: Number(item.cost),
            subTotal: Number(item.cost) * Number(item.cart),
            transactionCurrency: item.currency,
        }));
        await ticketsFacade.createSale(items);
        await get().loadData();
        await useTraceStore.getState().loadData();
    },

    addRefund: async (product, amount) => {
        await ticketsFacade.createRefund(product.id, Number(amount));
        await get().loadData();
        await useTraceStore.getState().loadData();
    },

    cleanTickets: async () => {
        await ticketsFacade.archiveAll();
        set({ ticketData: [] });
    },
}));

export default useTicketStore;
