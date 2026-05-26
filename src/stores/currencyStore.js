import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";

/**
 * @typedef currencyStore
 * @property {Array<String>} currencyList
 * @property {() => Promise<void>} loadData
 * @property {(currency: String) => Promise<void>} addCurrency
 * @property {(indexes: Array<Number>) => Promise<void>} deleteCurrency
 */
/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<currencyStore>>} */


const useCurrencyStore = create((set, get) => ({
    currencyList: [],

    loadData: async () => {
        const data = await loadData('currencies')
        set({ currencyList: data })
    },
    addCurrency: async (currency) => {
        const data = await updateData('currencies', currency)
        set({ currencyList: data })
    },
    deleteCurrency: async (indexes) => {
        const { currencyList } = get()
        const updateData = [...currencyList]
        const data = await writeData('currencies', updateData.filter((_, index) => !indexes.includes(index)))
        set({ currencyList: data })
    }
}))

export default useCurrencyStore