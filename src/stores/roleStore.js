

/**
 * @typedef roleStore
 * @property {Array} roleList
 * @property {() => Promise<void>} loadRoles
 * @property {(role: String) => Promise<void>} addRole
 * @property {(tag: Object, index :Number) => Promise<void>} modifyRole
 * @property {(roles: Array) => Promsie<void>} deleteRoles
 */

import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";
import { colorParser } from "../utils/tag-util";

/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<roleStore>>} */

const useRoleStore = create((set, get) => ({
    roleList: [],
    loadRoles: async () => {
        let data = await loadData('roles')
        if (!data) return
        data = data.map(role => ({ ...role, color: colorParser(role.color) }))

        set({ roleList: data })
    },
    addRole: async (role) => {
        let data = await updateData('roles', role)

        set({ roleList: data })
    },
    modifyRole: async (role, index) => {
        const { roleList } = get()

        const updatedData = [...roleList]
        updatedData[index] = role

        const data = await writeData('roles', updatedData)

        set({ roleList: data })
    },
    deleteRoles: async (indexes) => {
        const { roleList } = get()
        const transformedList = roleList.filter((_, index) => !indexes.includes(index))

        let data = await writeData('roles', transformedList)
        data = data.map(role => role.name)
        set({ roleList: data })
    },
}))

export default useRoleStore