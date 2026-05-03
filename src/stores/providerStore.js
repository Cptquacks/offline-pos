
/**
 * @typedef {Object} providerStore
 * @property {Array} providerData
 * @property {Number} paymentWaste
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
        let total = {
            "CUP": 0,
            "USD": 0
        }

        data.forEach(provider => {
            const endsAt = addDays(provider.startedAt, provider.span)
            const isExpired = daysFromToday(endsAt) <= 0

            provider.active && isExpired ? provider.active = false : provider.active
            !provider.active && !isExpired ? provider.active = true : provider.active
            total[provider.currency] += parseInt(provider.waste)
        })

        set({ providerData: data, paymentWaste: total })
    },

    addProvider: async (provider) => {
        const data = await updateData('providers', provider)
        let total = {
            "CUP": 0,
            "USD": 0
        }

        data.forEach(provider => {
            const endsAt = addDays(provider.startedAt, provider.span)
            const isExpired = daysFromToday(endsAt) <= 0

            provider.active && isExpired ? provider.active = false : provider.active
            !provider.active && !isExpired ? provider.active = true : provider.active
            total[provider.currency] += parseInt(provider.waste)
        })

        set({ providerData: data, paymentWaste: total })
    },
    modifyProvider: async (provider, index) => {
        const { providerData } = get()
        const updatedData = providerData

        updatedData[index] = provider

        const data = await writeData('providers', updatedData)
        let total = {
            "CUP": 0,
            "USD": 0
        }

        data.forEach(provider => {
            const endsAt = addDays(provider.startedAt, provider.span)
            const isExpired = daysFromToday(endsAt) <= 0

            provider.active && isExpired ? provider.active = false : provider.active
            !provider.active && !isExpired ? provider.active = true : provider.active
            total[provider.currency] += parseInt(provider.waste)
        })

        set({ providerData: data, paymentWaste: total })

    },
    deleteProvider: async (target) => {
        const { providerData } = get()
        let updatedData = providerData

        updatedData = updatedData.filter((_, index) => index !== target)

        const data = await writeData('providers', updatedData)
        let total = {
            "CUP": 0,
            "USD": 0
        }

        data.forEach(provider => {
            const endsAt = addDays(provider.startedAt, provider.span)
            const isExpired = daysFromToday(endsAt) <= 0

            provider.active && isExpired ? provider.active = false : provider.active
            !provider.active && !isExpired ? provider.active = true : provider.active
            total[provider.currency] += parseInt(provider.waste)
        })

        set({ providerData: data, paymentWaste: total })
    },
    overwriteData: async (chunk) => {
        const data = await writeData('providers', chunk)
        let total = {
            "CUP": 0,
            "USD": 0
        }

        data.forEach(provider => {
            const endsAt = addDays(provider.startedAt, provider.span)
            const isExpired = daysFromToday(endsAt) <= 0

            provider.active && isExpired ? provider.active = false : provider.active
            !provider.active && !isExpired ? provider.active = true : provider.active
            total[provider.currency] += parseInt(provider.waste)
        })

        set({ providerData: data, paymentWaste: total })
    }
}))

export default useProviderStore