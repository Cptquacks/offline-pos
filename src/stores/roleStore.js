

/**
 * @typedef roleStore
 * @property {Array} roleList
 * @property {() => Promise<void>} loadRoles
 * @property {(role: String) => Promise<void>} addRole
 * @property {(index: Number) => Promsie<void>} deleteRole
 */

import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";

/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<tagStore>>} */

const useRoleStore = create((set, get) => ({
    roleList: [],
    loadRoles: async () => {
        const data = await loadData('roles')
        set({ roleList: data })
    },
    addRole: async (role) => {
        const data = await updateData('roles', role)
        set({ roleList: data })
    },
    deleteRole: async (index) => {
        const { roleList } = get()
        const data = await writeData('roles', roleList.filter((_, i) => index !== i))
        set({ roleList: data })
    },
}))

export default useRoleStore