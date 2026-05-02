

/**
 * @typedef roleStore
 * @property {Array} roleList
 * @property {() => Promise<void>} loadRoles
 * @property {(role: String) => Promise<void>} addRole
 * @property {(roles: Array) => Promsie<void>} deleteRoles
 */

import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";

/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<roleStore>>} */

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
    deleteRoles: async (roles) => {
        const { roleList } = get()
        const data = await writeData('roles', roleList.filter(role => !roles.includes(role)))
        set({ roleList: data })
    },
}))

export default useRoleStore