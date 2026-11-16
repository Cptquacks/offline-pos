import { create } from "zustand";
import * as tagsFacade from "../facades/tags-facade";

const CURRENCY_TYPE = 2;

const useCurrencyStore = create((set, get) => ({
    currencyList: [],
    currencyData: [],

    loadData: async () => {
        const currencyData = await tagsFacade.listByType(CURRENCY_TYPE);
        set({
            currencyData,
            currencyList: currencyData.map((currency) => currency.name),
        });
    },

    addCurrency: async (name) => {
        const normalized = String(name).trim().toUpperCase();
        if (!/^[A-Z]{3}$/.test(normalized)) {
            throw new Error("La moneda debe ser un código de tres letras.");
        }
        const exists = get().currencyData.some((currency) => currency.name === normalized);
        if (exists) return;
        await tagsFacade.create({ name: normalized, type: CURRENCY_TYPE, color: null });
        await get().loadData();
    },

    deleteCurrency: async (ids) => {
        await tagsFacade.removeMany(ids);
        await get().loadData();
    },
}));

export default useCurrencyStore;
