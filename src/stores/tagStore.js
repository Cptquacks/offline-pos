

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
        let data = await loadData('tags')

        set({ tagList: data })
    },
    addTag: async (tag) => {
        let data = await updateData('tags', { name: tag })
        data = data.map(tag => `${tag.name}`)

        set({ tagList: data })
    },
    deleteTags: async (tags) => {
        const { tagList } = get()
        const transformedList = tagList
            .filter(tag => !tags.includes(tag))
            .map(tag => ({ name: tag }))

        let data = await writeData('tags', transformedList)
        data = data.map(tag => `${tag.name}`)
        set({ tagList: data })
    },
}))

export default useTagStore