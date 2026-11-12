
/**
 * @typedef {Object} providerStore
 * @property {Array} providerData
 * @property {Object} paymentWaste
 * @property {() => Promise<void>} loadData
 * @property {(provider: Object) => Promise<void>} addProvider
 * @property {(provider: Object, index: number) => Promise<void>} modifyProvider
 * @property {(target: number) => Promise<void>} deleteProvider
 * @property {(chunk: Array) => Promise<void>} overwriteData
 */

import { create } from 'zustand';
import { loadData, updateData, writeData } from '../utils/storage-util';
import { addDays, daysFromToday } from '../utils/date-util';

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<providerStore>>} */

const useProviderStore = create((set, get) => ({
    providerData: [],
    paymentWaste: {
        "CUP": 0,
        "USD": 0
    },

    loadData: async () => {
        const data = await loadData('providers')
        let total = {}

        data.forEach(provider => {
            const endsAt = addDays(provider.startedAt, provider.span)
            const isExpired = daysFromToday(endsAt) <= 0

            if (!provider.active && !isExpired) return


            provider.active = !isExpired
            total[provider.currency] += parseInt(provider.waste)
        })

        set({ providerData: data, paymentWaste: total })
    },

    addProvider: async (provider) => {
        const { paymentWaste } = get()
        const data = await updateData('providers', provider)

        let total = { ...paymentWaste }
        if (!total[provider.currency]) total[provider.currency] = 0
        total[provider.currency] += parseInt(provider.waste)

        set({ providerData: data, paymentWaste: total })
    },
    modifyProvider: async (provider, index) => {
        const { providerData, paymentWaste } = get()
        const updatedData = [...providerData]
        updatedData[index] = provider

        const data = await writeData('providers', updatedData)

        let total = { ...paymentWaste }
        if (!total[provider.currency]) total[provider.currency] = 0
        total[provider.currency] += parseInt(provider.waste)

        set({ providerData: data, paymentWaste: total })

    },
    deleteProvider: async (target) => {
        const { providerData, paymentWaste } = get()
        let updatedData = [...providerData]

        const provider = providerData[target]

        let total = { ...paymentWaste }
        if (!total[provider.currency]) total[provider.currency] = 0
        total[provider.currency] -= parseInt(provider.waste)

        updatedData = updatedData.filter((_, index) => index !== target)
        const data = await writeData('providers', updatedData)

        set({ providerData: data, paymentWaste: total })
    },

    overwriteData: async (chunk) => {
        const { loadData } = get()
        const data = await writeData('providers', chunk)

        set({ providerData: data })
        await loadData()
    }
}))

export default useProviderStore