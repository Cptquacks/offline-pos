import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";




/**
 * @typedef {Object} traceStore
 * @property {Array} traceData
 * @property {Object} currentTrace
 * @property {Boolean} traceLoaded
 * @property {() => Promise<void>} loadData
 * @property {(trace) => Promise<void>} addTrace
 * @property {() => Promise<void>} closeTrace
 * @property {(trace: Object) => Promise<void>} updateTrace
 * @property {() => Promise<void>} normalizeTrace
 * @property {(chunk: Array) => Promise<void>} overwriteTrace
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
        data.sort((a, b) => b.date.localeCompare(a.date))

        const { traceLoaded, currentTrace } = get()
        const currentDate = new Date().toLocaleDateString('sv-SE') // Obtener fecha local de hoy

        const lastDay = (data ?? []).toSorted((a, b) => a.date.localeCompare(b.date))[0] // Obtener ultimo dia -> fecha
        const currentTraceValid = Object.values(currentTrace).length > 0

        if (data.length === 0 || (!traceLoaded && currentDate > lastDay.date)) {
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
                }
            })

            data = await updateData('traces', data[data.length - 1])
            data.sort((a, b) => b.date.localeCompare(a.date))

            set({
                traceData: data,
                currentTrace: data[data.length - 1],
                traceLoaded: true
            })
            return
        }

        if (!currentTraceValid) {
            set({
                traceData: data,
                currentTrace: data[data.length - 1],
                traceLoaded: true
            })
            return
        }

        set({
            traceData: data,
            traceLoaded: true
        })
    },

    addTrace: async (trace) => {
        const { traceData, traceLoaded } = get()
        let updatedData = traceData.map(trace => trace)
        updatedData = updatedData.filter(trace => trace.sells !== 0 || trace.refunds !== 0)

        if (!traceLoaded) return

        updatedData.push(trace)
        updatedData.push({
            "date": new Date().toLocaleDateString('sv-SE'),
            "refunds": 0,
            "sells": 0,
            "total": {
            }
        })
        updatedData.sort((a, b) => b.date.localeCompare(a.date))

        const data = await writeData('traces', updatedData)
        set({ traceData: data, currentTrace: data[data.length - 1] })
    },

    closeTrace: async () => {

        const { traceData, currentTrace, traceLoaded } = get()
        let updatedData = traceData.toReversed()
        updatedData = updatedData.filter(trace => trace.sells !== 0 || trace.refunds !== 0)

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


        let data = await writeData('traces', updatedData)
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({ traceData: data.toReversed(), currentTrace: data.toReversed()[0] })
    },

    updateTrace: async (trace) => {
        const { currentTrace } = get()
        let currentData = await loadData('traces')
        currentData.sort((a, b) => b.date.localeCompare(a.date))

        if (currentTrace.date.localeCompare(currentData[currentData.length - 1].date))
            currentData.push(currentTrace)

        currentData.sort((a, b) => b.date.localeCompare(a.date))
        currentData[currentData.length - 1] = { ...currentTrace, ...trace }

        let data = writeData('traces', currentData)
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({ traceData: data, currentTrace: data[data.length - 1] })
    },

    normalizeTrace: async () => {
        const { traceData, traceLoaded } = get()

        if (!traceLoaded) return

        let updatedTrace = traceData
            .map(trace => trace)
            .sort((a, b) => b.date.localeCompare(a.date))

        let groupedTrace = {}

        const today = new Date().toLocaleDateString('sv-SE')
        const todayTraces = updatedTrace.filter(trace => trace.date === today)

        updatedTrace
            .filter(trace => trace.date !== today)
            .forEach(trace => {
                if (!groupedTrace[trace.date]) {
                    groupedTrace[trace.date] = {
                        date: trace.date,
                        refunds: 0,
                        sells: 0,
                        total: {}
                    }
                }

                groupedTrace[trace.date].refunds += parseInt(trace.refunds)
                groupedTrace[trace.date].sells += parseInt(trace.sells)

                Object.keys(trace.total).forEach(entry => {
                    if (!groupedTrace[trace.date].total[entry]) {
                        groupedTrace[trace.date].total[entry] = 0
                    }

                    groupedTrace[trace.date].total[entry] += parseInt(trace.total[entry])
                })

            })
        updatedTrace = Object.values(groupedTrace)

        let data = await writeData('traces', [...updatedTrace, ...todayTraces])
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({ traceData: data, currentTrace: data[data.length - 1] })
    },

    overwriteTrace: async (chunk) => {
        let data = await writeData('traces', chunk)
        data.push({
            "date": new Date().toLocaleDateString('sv-SE'),
            "refunds": 0,
            "sells": 0,
            "total": {
                "CUP": 0,
                "USD": 0
            }
        })
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({ traceData: data, currentTrace: data[data.length - 1] })
    },

    /**
     * Cart interactions
     */
    addSell: async (cartItems) => {
        const { currentTrace } = get();
        const updatedTrace = currentTrace;

        cartItems.forEach(item => {
            updatedTrace.sells += parseInt(item.cart)

            if (!updatedTrace.total[item.currency])
                updatedTrace.total[item.currency] = 0

            updatedTrace.total[item.currency] += parseInt(item.price) * parseInt(item.cart)
        })

        set({ currentTrace: updatedTrace });
    },

    addRefund: async (product, amount) => {
        const { currentTrace } = get();
        const updatedTrace = { ...currentTrace };

        updatedTrace.sells -= parseInt(amount)
        updatedTrace.refunds += parseInt(amount)

        set({ currentTrace: updatedTrace });
    }
}));
export default useTraceStore