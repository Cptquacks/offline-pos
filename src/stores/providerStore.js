import { create } from "zustand";
import * as providersFacade from "../facades/providers-facade";
import * as notesFacade from "../facades/notes-facade";
import { addDays, daysFromToday } from "../utils/date-util";

function fromDatabase(provider) {
    const span = Number(provider.span ?? 31);
    const active = Boolean(provider.active) &&
        daysFromToday(addDays(provider.startedAt || new Date().toLocaleDateString("sv-SE"), span)) > 0;
    return {
        ...provider,
        span,
        active,
        contactData: provider.contacts?.map((contact) => ({ value: contact.phone })) ?? [],
        notes: provider.notes ?? [],
    };
}

function toDatabase(provider) {
    const {
        contactData = [], contacts: _contacts, notes: _notes,
        id: _id, createdAt: _createdAt, ...rest
    } = provider;
    const startedAt = rest.startedAt || new Date().toLocaleDateString("sv-SE");
    const parsedSpan = Number(rest.span);
    const span = Number.isFinite(parsedSpan) && parsedSpan > 0 ? parsedSpan : 31;
    return {
        ...rest,
        startedAt,
        span,
        endsAt: addDays(startedAt, span),
        waste: Number(rest.waste) || 0,
        currency: rest.currency || "CUP",
        active: rest.active === undefined ? 1 : rest.active ? 1 : 0,
        contacts: contactData.filter((contact) => contact?.value).map((contact) => ({ phone: String(contact.value) })),
    };
}

function setProviders(set, records) {
    const providerData = records.map(fromDatabase);
    const paymentWaste = {};
    for (const provider of providerData) {
        if (!provider.active) continue;
        paymentWaste[provider.currency] = (paymentWaste[provider.currency] ?? 0) + Number(provider.waste || 0);
    }
    set({ providerData, paymentWaste });
}

const useProviderStore = create((set, get) => ({
    providerData: [],
    paymentWaste: { CUP: 0, USD: 0 },

    loadData: async () => setProviders(set, await providersFacade.listAll(true)),

    addProvider: async (provider) => {
        const created = await providersFacade.create(toDatabase(provider));
        if (!created) throw new Error("No se pudo crear el proveedor.");
        await get().loadData();
    },

    addMany: async (providers) => {
        await providersFacade.createMany(providers.map(toDatabase));
        await get().loadData();
    },

    modifyProvider: async (id, patch) => {
        const updated = await providersFacade.update(id, toDatabase(patch));
        if (!updated) throw new Error(`No se encontró el proveedor ${id}.`);
        await get().loadData();
    },

    deleteProvider: async (id) => {
        const removed = await providersFacade.remove(id);
        if (!removed) throw new Error(`No se encontró el proveedor ${id}.`);
        await get().loadData();
    },

    deleteMany: async (ids) => {
        await providersFacade.removeMany(ids);
        await get().loadData();
    },

    addNote: async (providerId, note) => {
        await notesFacade.create("provider", providerId, note);
        await get().loadData();
    },

    deleteNote: async (noteId) => {
        await notesFacade.remove(noteId);
        await get().loadData();
    },
}));

export default useProviderStore;
