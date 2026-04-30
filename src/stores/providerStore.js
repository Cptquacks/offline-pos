
/**
 * @typedef {Object} providerStore
 * @property {Array} providerData
 * @property {Number} paymentWaste
 * @property {() => Promise<void>} loadData
 * @property {(provider: Object) => Promise<void>} addProvider
 * @property {(provider: Object, index: number) => Promise<void>} modifyProvider
 * @property {(target: number) => Promise<void>} deleteProvider
 */

import { create } from 'zustand';
import { loadData, updateData, writeData } from '../utils/storage-util';

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<providerStore>>} */

const useProviderStore = create((set, get) => ({
    providerData: [],
    paymentWaste: 0,

    loadData: async () => {
        const data = await loadData('providers')
        let total = 0

        data.forEach(provider => {
            provider.active = !(new Date().toLocaleDateString('sv-SE') >= provider.endsAt)
            total += parseInt(provider.waste)
        })

        set({ providerData: data, paymentWaste: total })
    },

    addProvider: async (provider) => {
        const data = await updateData('providers', provider)
        let total = 0

        data.forEach(member => {
            total += parseInt(member.salary)
        });

        set({ providerData: data, paymentWaste: total })
    },
    modifyProvider: async (provider, index) => {
        console.log(provider)
        const { providerData } = get()
        const updatedData = providerData

        updatedData[index] = provider

        const data = await writeData('providers', updatedData)
        let total = 0

        data.forEach(provider => {
            total += parseInt(provider.waste)
        });

        set({ providerData: data, paymentWaste: total })

    },
    deleteProvider: async (target) => {
        const { providerData } = get()
        let updatedData = providerData

        updatedData = updatedData.filter((_, index) => index !== target)

        const data = await writeData('providers', updatedData)
        let total = 0

        data.forEach(provider => {
            total += parseInt(provider.waste)
        });

        set({ providerData: data, paymentWaste: total })
    }
}))

export default useProviderStore