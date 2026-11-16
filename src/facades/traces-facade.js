export function listAll(withRelations = false) {
    return window.electronAPI.tracesListAll(withRelations);
}

export function getOrCreateToday() {
    return window.electronAPI.tracesGetOrCreateToday();
}

export function create(trace) {
    return window.electronAPI.tracesCreate(trace);
}

export function update(id, patch) {
    return window.electronAPI.tracesUpdate(id, patch);
}

export function close(id) {
    return window.electronAPI.tracesClose(id);
}

export function upsertManualMany(entries) {
    return window.electronAPI.tracesUpsertManualMany(entries);
}
