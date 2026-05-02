

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
        let data = await loadData('roles')
        data = data.map(tag => `${tag}`)
        set({ roleList: data })
    },
    addRole: async (role) => {
        let data = await updateData('roles', { name: `${role}` })
        data = data.map(tag => `${tag}`)
        set({ roleList: data })
    },
    deleteRoles: async (roles) => {
        const { roleList } = get()
        const transformedList = roleList
            .filter(role => !roles.includes(role))
            .map(entry => ({ name: entry }))

        let data = await writeData('roles', transformedList)
        data = data.map(tag => `${tag}`)
        set({ roleList: data })
    },
}))

export default useRoleStore