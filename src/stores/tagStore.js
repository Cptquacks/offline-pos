import { create } from "zustand";
import * as tagsFacade from "../facades/tags-facade";
import { colorParser, OriginalLCHParser } from "../utils/tag-util";

const TAG_TYPE = 0;

function present(tag) {
    return { ...tag, color: colorParser(tag.color) };
}

const useTagStore = create((set, get) => ({
    tagList: [],

    loadTags: async () => {
        const rows = await tagsFacade.listByType(TAG_TYPE);
        set({ tagList: rows.map(present) });
    },

    addTag: async (tag) => {
        await tagsFacade.create({
            name: tag.name.trim(),
            color: OriginalLCHParser(tag.color),
            type: TAG_TYPE,
        });
        await get().loadTags();
    },

    modifyTag: async (tag, id) => {
        const updated = await tagsFacade.update(id, {
            name: tag.name,
            color: OriginalLCHParser(tag.color),
        });
        if (!updated) throw new Error(`No se encontró el tag ${id}.`);
        await get().loadTags();
    },

    deleteTags: async (ids) => {
        await tagsFacade.removeMany(ids);
        await get().loadTags();
    },
}));

export default useTagStore;
