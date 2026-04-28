import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";




/**
 * @typedef {Object} traceStore
 * @property {Array} traceData
 * @property {Object} currentTrace
 * @property {Boolean} traceLoaded
 * @property {() => Promise<void>} loadData
 * @property {() => Promise<void>} closeTrace
 * @property {(trace: Object) => Promise<void>} updateTrace
 * @property {(cartItems: Array) => Promise<void>} addSell
 * @property {(product: Object, amount: Number) => Promise<void>} addRefund
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<traceStore>>} */
const useTraceStore = create((set, get) => ({
    traceData: [],
    currentTrace: {},
    traceLoaded: false,

    loadData: async () => {
        let data = await loadData('traces')

        const { traceLoaded, currentTrace } = get()
        const currentDate = new Date().toLocaleDateString('sv-SE') // Obtener fecha local de hoy
        const lastDay = data.toReversed()[0] // Obtener ultimo dia -> fecha
        const entries = data.filter(trace => trace.date === currentDate)

        if ((!traceLoaded && entries.length === 0) && currentDate > lastDay.date) {
            /**
             * Si no hay traza cargada y ademas el dia es mayor al ultimo dia
             * 1. Cerramos automaticamente
             * 2. Actualizamos los datos
             * 3. Cargamos parametros
             */

            data.push({
                "date": new Date().toLocaleDateString('sv-SE'),
                "refunds": 0,
                "sells": 0,
                "total": {
                    "CUP": 0,
                    "USD": 0
                }
            })

            data = await updateData('traces', data.toReversed()[0])

            set({ traceData: data.toReversed(), currentTrace: data.toReversed()[0], traceLoaded: true })
            return
        }

        if (!currentTrace.date) {
            set({ traceData: data.toReversed(), currentTrace: data.toReversed()[0], traceLoaded: true })
            return
        }

        set({ traceData: data.toReversed(), traceLoaded: true })
    },

    closeTrace: async () => {

        const { traceData, currentTrace, traceLoaded } = get()
        let updatedData = traceData.toReversed()
        updatedData = updatedData.filter(trace => trace.sells !== 0 || trace.refunds !== 0)

        console.log(updatedData)
        if (!traceLoaded) return

        updatedData.push(currentTrace)
        updatedData.push({
            "date": new Date().toLocaleDateString('sv-SE'),
            "refunds": 0,
            "sells": 0,
            "total": {
                "CUP": 0,
                "USD": 0
            }
        })


        const data = await writeData('traces', updatedData)

        set({ traceData: data.toReversed(), currentTrace: data.toReversed()[0] })
    },

    updateTrace: async (trace) => {
        const { currentTrace } = get()
        const currentData = await loadData('traces')

        if (currentTrace.date > currentData.toReversed()[0].date)
            currentData.push(currentTrace)

        currentData.toReversed()[0] = { ...currentTrace, ...trace }

        const data = writeData('traces', currentData)

        set({ traceData: data.toReversed(), currentTrace: data.toReversed()[0] })
    },

    /**
     * Cart interactions
     */
    addSell: async (cartItems) => {
        const { currentTrace } = get();
        const updatedTrace = currentTrace;

        cartItems.forEach(item => {
            updatedTrace.sells += parseInt(item.cart)
            updatedTrace.total[item.currency] += parseInt(item.price)
        })

        console.log(updatedTrace)

        set({ currentTrace: updatedTrace });
    },

    addRefund: async (product, amount) => {
        const { currentTrace } = get();
        const updatedTrace = { ...currentTrace };

        updatedTrace.sells -= parseInt(amount)
        updatedTrace.refunds += parseInt(amount)
        updatedTrace.total[product.currency] -= parseInt(product.price)
        console.log(updatedTrace)

        set({ currentTrace: updatedTrace });
    }
}));
export default useTraceStore