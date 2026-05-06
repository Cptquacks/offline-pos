import { create } from "zustand";
import { loadData, updateData } from "../utils/storage-util";

/**
 * @typedef licenseStore
 * @property {Array} licenseList
 * @property {() => Promise<void>} loadLicenses
 * @property {(license) => Promise<void>} addLicense
 */

/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<licenseStore>>} */


const useLicenseStore = create((set) => ({
    licenseList: [],

    loadLicenses: async () => {
        const data = await loadData('licenses')
        set({ licenseList: data })
    },
    addLicense: async (license) => {

        const data = await updateData('licenses', { code: license.code, date: license.date })
        set({ licenseList: data })
    }
}))

export default useLicenseStore