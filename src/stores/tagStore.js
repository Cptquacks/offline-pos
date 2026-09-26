

/**
 * @typedef tagStore
 * @property {Array} tagList
 * @property {() => Promise<void>} loadTags
 * @property {(tag: String) => Promise<void>} addTag
 * @property {(tag: Object, index :Number) => Promise<void>} modifyTag
 * @property {(tags: Array) => Promsie<void>} deleteTags
 */

import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";
import { colorParser, OriginalLCHParser } from "../utils/tag-util";

/**@type {import("zustand").UseBoundStore<import("zustand").StoreApi<tagStore>>} */

const useTagStore = create((set, get) => ({
    tagList: [],

    loadTags: async () => {
        let data = await loadData('tags')
        data = data.map(tag => ({ ...tag, color: colorParser(tag.color) }))

        set({ tagList: data })
    },
    addTag: async (tag) => {
        const data = await updateData('tags', ({ ...tag, color: OriginalLCHParser(tag.color) }))

        set({ tagList: data })
    },
    modifyTag: async (tag, index) => {
        const { tagList } = get()

        const updatedData = [...tagList]
        updatedData[index] = tag

        const data = await writeData('tags', updatedData)

        set({ tagList: data })
    },
    deleteTags: async (indexes) => {
        const { tagList } = get()
        const transformedList = tagList.filter((_, index) => !indexes.includes(index))

        const data = await writeData('tags', transformedList)
        set({ tagList: data })
    },
}))

export default useTagStore