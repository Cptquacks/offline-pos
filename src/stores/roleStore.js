import { create } from "zustand";
import * as tagsFacade from "../facades/tags-facade";
import { colorParser, OriginalLCHParser } from "../utils/tag-util";

const ROLE_TYPE = 1;
const present = (role) => ({ ...role, color: colorParser(role.color) });

const useRoleStore = create((set, get) => ({
    roleList: [],

    loadRoles: async () => {
        const rows = await tagsFacade.listByType(ROLE_TYPE);
        set({ roleList: rows.map(present) });
    },

    addRole: async (role) => {
        await tagsFacade.create({
            name: role.name.trim(),
            color: OriginalLCHParser(role.color),
            type: ROLE_TYPE,
        });
        await get().loadRoles();
    },

    modifyRole: async (role, id) => {
        const updated = await tagsFacade.update(id, {
            name: role.name,
            color: OriginalLCHParser(role.color),
        });
        if (!updated) throw new Error(`No se encontró el rol ${id}.`);
        await get().loadRoles();
    },

    deleteRoles: async (ids) => {
        await tagsFacade.removeMany(ids);
        await get().loadRoles();
    },
}));

export default useRoleStore;
