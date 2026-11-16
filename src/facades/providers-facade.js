export function listAll(withRelations = true) {
    return window.electronAPI.providersListAll(withRelations);
}

export function create(provider) {
    return window.electronAPI.providersCreate(provider);
}

export function createMany(providers) {
    return window.electronAPI.providersCreateMany(providers);
}

export function update(id, patch) {
    return window.electronAPI.providersUpdate(id, patch);
}

export function remove(id) {
    return window.electronAPI.providersRemove(id);
}

export function removeMany(ids) {
    return window.electronAPI.providersRemoveMany(ids);
}
