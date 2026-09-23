import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";

/**
 * @typedef {Object} staffStore
 * @property {Array} staffData
 * @property {number} salaryWaste
 * @property {() => Promise<void>} loadData
 * @property {(staff: Object) => Promise<void>} addStaff
 * @property {(staff: Object, index: number) => Promise<void>} modifyStaff
 * @property {(target: number) => Promise<void>} deleteStaff
 * @property {(chunk: Array) => Promise<void>} overwriteFile
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<staffStore>>} */
const useStaffStore = create((set, get) => ({
    staffData: [],
    salaryWaste: 0,

    loadData: async () => {
        const data = await loadData('staff')

        let total = 0
        data.forEach(member => total += parseFloat(member.salary));

        set({ staffData: data, salaryWaste: total })
    },

    addStaff: async (staff) => {
        const { salaryWaste } = get()
        const data = await updateData('staff', staff)

        set({ staffData: data, salaryWaste: salaryWaste + parseFloat(staff.salary) })
    },

    modifyStaff: async (staff, index) => {
        const { staffData } = get()
        const updatedData = [...staffData]

        const cleanStaff = Object.fromEntries(
            Object.entries(staff).filter(([key]) => !['index'].includes(key))
        )
        updatedData[index] = cleanStaff

        const data = await writeData('staff', updatedData)

        let total = 0
        data.forEach(member => {
            total += parseInt(member.salary)
        });

        set({ staffData: data, salaryWaste: total })
    },

    deleteStaff: async (target) => {
        const { staffData, salaryWaste } = get()
        let updatedData = [...staffData]

        const total = salaryWaste - parseFloat(updatedData[target].salary)
        updatedData = updatedData.filter((_, index) => index !== target)

        const data = await writeData('staff', updatedData)

        set({ staffData: data, salaryWaste: total })
    },

    overwriteFile: async (chunk) => {
        const data = await writeData('staff', chunk)
        set({ staffData: data })
    }
}))

export default useStaffStore