import { create } from "zustand";
import { loadData, writeData } from "../utils/storage-util";

/**
 * @typedef preferenceStore
 * @property {Array} preferenceData
 * @property {() =>  Promise<void>} loadData
 * @property {(key: string, value: boolean) => Promise<void>} setPreference 
 */

/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<preferenceStore>>} */

const usePreferenceStore = create((set, get) => ({
    preferenceData: [],

    loadData: async () => {
        const data = await loadData('preferences')

        set({ preferenceData: data })
    },
    setPreference: async (index, value) => {
        const { preferenceData } = get()

        let updatedData = [...preferenceData]
        updatedData[index].value = value

        console.log(updatedData)
        const data = await writeData('preferences', updatedData)
        console.log(data)
        set({ preferenceData: data })
    }
}))
export default usePreferenceStore