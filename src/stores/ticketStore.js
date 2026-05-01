import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";


/**
 * @typedef {Object} ticketStore
 * @property {Array} ticketData
 * @property {() => Promise<void>} loadData
 * @property {(product: Object) => Promise<void>} addTicket
 * @property {(target: number) => Promise<void>} cleanTickets
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ticketStore>>} */
const useTicketStore = create((set) => ({
    ticketData: [],

    loadData: async () => {
        const data = await loadData('tickets') ?? []
        set({ ticketData: data.toReversed() })
    },
    addTicket: async (ticket) => {
        const data = await updateData('tickets', ticket) ?? []
        set({ ticketData: data.toReversed() })
    },
    cleanTickets: async () => {
        const data = await writeData('tickets', []) ?? []
        set({ productData: data.toReversed() })
    }
}))
export default useTicketStore