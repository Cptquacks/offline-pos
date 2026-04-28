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
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<staffStore>>} */
const useStaffStore = create((set, get) => ({
    staffData: [],
    salaryWaste: 0,

    loadData: async () => {
        const data = await loadData('staff')
        let total = 0

        data.forEach(member => {
            total += parseInt(member.salary)
        });

        set({ staffData: data, salaryWaste: total })
    },

    addStaff: async (staff) => {
        const data = await updateData('staff', staff)
        let total = 0

        data.forEach(member => {
            total += parseInt(member.salary)
        });
        console.log(staff)

        set({ staffData: data, salaryWaste: total })
    },

    modifyStaff: async (staff, index) => {
        const { staffData } = get()
        const updatedData = staffData

        updatedData[index] = staff

        const data = await writeData('staff', updatedData)
        let total = 0

        data.forEach(member => {
            total += parseInt(member.salary)
        });

        set({ staffData: data, salaryWaste: total })
    },

    deleteStaff: async (target) => {
        const { staffData } = get()
        let updatedData = staffData

        updatedData = updatedData.filter((_, index) => index !== target)

        const data = await writeData('staff', updatedData)
        let total = 0

        data.forEach(member => {
            total += parseInt(member.salary)
        });

        set({ staffData: data, salaryWaste: total })
    }
}))

export default useStaffStore