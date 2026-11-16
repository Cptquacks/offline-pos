import { create } from "zustand";
import * as staffFacade from "../facades/staff-facade";
import * as notesFacade from "../facades/notes-facade";

function fromDatabase(member) {
    return {
        ...member,
        ID: member.uid,
        charge: member.role,
        startDate: member.startedAt,
        endDate: member.endsAt,
        contact: member.contacts?.map((contact) => contact.phone).join(", ") ?? "",
        notes: member.notes ?? [],
    };
}

function toDatabase(member) {
    const {
        ID, charge, startDate, endDate, contact, contacts: _contacts, notes: _notes,
        index: _index, id: _id, createdAt: _createdAt, ...rest
    } = member;
    if (ID === undefined || ID === null || String(ID).trim() === "") {
        throw new Error("El carnet de identidad es obligatorio.");
    }
    return {
        ...rest,
        uid: String(ID ?? ""),
        role: charge || null,
        startedAt: startDate || null,
        endsAt: endDate || null,
        salary: Number(member.salary) || 0,
        currency: member.currency || "CUP",
        contacts: contact ? [{ phone: String(contact) }] : [],
    };
}

function setStaff(set, records) {
    const staffData = records.map(fromDatabase);
    set({
        staffData,
        salaryWaste: staffData.reduce((total, member) => total + Number(member.salary || 0), 0),
    });
}

const useStaffStore = create((set, get) => ({
    staffData: [],
    salaryWaste: 0,

    loadData: async () => setStaff(set, await staffFacade.listAll(true)),

    addStaff: async (member) => {
        const created = await staffFacade.create(toDatabase(member));
        if (!created) throw new Error("No se pudo crear el empleado.");
        await get().loadData();
    },

    addMany: async (members) => {
        await staffFacade.createMany(members.map(toDatabase));
        await get().loadData();
    },

    modifyStaff: async (id, patch) => {
        const updated = await staffFacade.update(id, toDatabase(patch));
        if (!updated) throw new Error(`No se encontró el empleado ${id}.`);
        await get().loadData();
    },

    deleteStaff: async (id) => {
        const removed = await staffFacade.remove(id);
        if (!removed) throw new Error(`No se encontró el empleado ${id}.`);
        await get().loadData();
    },

    deleteMany: async (ids) => {
        await staffFacade.removeMany(ids);
        await get().loadData();
    },

    addNote: async (staffId, note) => {
        await notesFacade.create("staff", staffId, note);
        await get().loadData();
    },

    deleteNote: async (noteId) => {
        await notesFacade.remove(noteId);
        await get().loadData();
    },

    overwriteFile: async (members) => get().addMany(members),
}));

export default useStaffStore;
