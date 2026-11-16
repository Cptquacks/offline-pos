import { create } from "zustand";
import * as tracesFacade from "../facades/traces-facade";
import { getToday } from "../utils/date-util";

function sortTraces(traces) {
    return [...traces].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

const useTraceStore = create((set, get) => ({
    traceData: [],
    currentTrace: null,
    traceLoaded: false,

    loadData: async () => {
        const traces = sortTraces(await tracesFacade.listAll());
        const today = getToday();
        let currentTrace = traces.find((trace) => trace.date === today && !trace.isClosed);
        if (!currentTrace) currentTrace = await tracesFacade.getOrCreateToday();
        set({
            traceData: sortTraces([currentTrace, ...traces.filter((trace) => trace.id !== currentTrace.id)]),
            currentTrace,
            traceLoaded: true,
        });
    },

    ensureToday: async () => {
        const currentTrace = await tracesFacade.getOrCreateToday();
        set((state) => ({
            currentTrace,
            traceData: sortTraces([
                currentTrace,
                ...state.traceData.filter((trace) => trace.id !== currentTrace.id),
            ]),
            traceLoaded: true,
        }));
        return currentTrace;
    },

    addTrace: async (trace) => {
        await tracesFacade.create({
            ...trace,
            refunds: Number(trace.refunds) || 0,
            sells: Number(trace.sells) || 0,
            total: trace.total ?? {},
            isClosed: 1,
        });
        await get().loadData();
    },

    closeTrace: async () => {
        const { currentTrace } = get();
        if (currentTrace && !currentTrace.isClosed) await tracesFacade.close(currentTrace.id);
        await get().loadData();
    },

    updateTrace: async (trace, id) => {
        const updated = await tracesFacade.update(id, trace);
        if (!updated) throw new Error(`No se encontró la traza ${id}.`);
        await get().loadData();
    },

    normalizeTrace: async () => get().loadData(),

    overwriteTrace: async (entries) => {
        await tracesFacade.upsertManualMany(entries);
        await get().loadData();
    },
}));

export default useTraceStore;
