

/**
 * @typedef tagStore
 * @property {Array} tagList
 * @property {() => Promise<void>} loadTags
 * @property {(tag: String) => Promise<void>} addTag
 * @property {(tags: Array) => Promsie<void>} deleteTags
 */

import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";

/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<tagStore>>} */

const useTagStore = create((set, get) => ({
    tagList: [],

    loadTags: async () => {
        const data = await loadData('tags')

        set({ tagList: data })
    },
    addTag: async (tag) => {
        const data = await updateData('tags', { name: tag })

        set({ tagList: data })
    },
    deleteTags: async (tags) => {
        const { tagList } = get()
        const transformedList = tagList
            .filter(tag => !tags.includes(tag))
            .map(tag => ({ name: tag }))

        const data = await writeData('tags', transformedList)
        set({ tagList: data })
    },
}))

export default useTagStore