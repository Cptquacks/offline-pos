import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";
import { getToday } from "../utils/date-util";




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
    currentTrace: null,
    traceLoaded: false,

    loadData: async () => {
        const { currentTrace } = get()

        let data = await loadData('traces') ?? []
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({
            traceData: data,
            currentTrace: currentTrace ?? {
                'date': getToday(),
                'refunds': 0,
                'sells': 0,
                'total': {}
            },
            traceLoaded: true
        })
    },

    addTrace: async (trace) => {
        let data = await updateData('traces', trace)
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({
            traceData: data,
            currentTrace: {
                'date': getToday(),
                'refunds': 0,
                'sells': 0,
                'total': {}
            },
            traceLoaded: true
        })
    },

    closeTrace: async () => {
        set({
            currentTrace: {
                'date': getToday(),
                'refunds': 0,
                'sells': 0,
                'total': {}
            },
            traceLoaded: true
        })
    },

    updateTrace: async (trace, index) => {
        const { traceData } = get()
        let updatedTraces = new Array(traceData)
        updatedTraces[index] = { ...updatedTraces[index], ...trace }

        let data = await writeData('traces', updatedTraces)
        data.sort((a, b) => a.date.localeCompare(b.date))

        set({
            traceData: data,
            currentTrace: {
                'date': getToday(),
                'refunds': 0,
                'sells': 0,
                'total': {}
            },
            traceLoaded: true
        })
    },

    normalizeTrace: async () => {
        const { traceData, currentTrace, traceLoaded } = get()
        if (!traceLoaded) return

        let groupedTrace = {}
        let updatedTrace = traceData
            .map(trace => trace)
            .sort((a, b) => b.date.localeCompare(a.date))


        updatedTrace
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

        let data = await writeData(
            'traces',
            [
                ...updatedTrace,
                currentTrace,
                {
                    date: getToday(),
                    refunds: 0,
                    sells: 0,
                    total: {}
                }
            ]
        )
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({ traceData: data })
    },

    overwriteTrace: async (chunk) => {
        let data = await writeData('traces', chunk)
        data.push({
            "date": getToday(),
            "refunds": 0,
            "sells": 0,
            "total": {
                "CUP": 0,
                "USD": 0
            }
        })
        data.sort((a, b) => b.date.localeCompare(a.date))

        set({ traceData: data, currentTrace: data[0] })
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
        const updatedTrace = {
            ...currentTrace,
            refunds: currentTrace.refunds + parseInt(amount),
        };

        if (!updatedTrace.total[product.currency] || !product.currency)
            updatedTrace.total['CUP'] = 0

        else
            updatedTrace.total[product.currency] -= product.price

        set({ currentTrace: updatedTrace });
    }
}));
export default useTraceStore