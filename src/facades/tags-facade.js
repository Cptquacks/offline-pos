export function listByType(type) {
    return window.electronAPI.tagsListByType(type);
}

export function create(tag) {
    return window.electronAPI.tagsCreate(tag);
}

export function update(id, patch) {
    return window.electronAPI.tagsUpdate(id, patch);
}

export function removeMany(ids) {
    return window.electronAPI.tagsRemoveMany(ids);
}
