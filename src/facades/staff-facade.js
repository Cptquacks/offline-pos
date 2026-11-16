export function listAll(withRelations = true) {
    return window.electronAPI.staffListAll(withRelations);
}

export function create(staff) {
    return window.electronAPI.staffCreate(staff);
}

export function createMany(staff) {
    return window.electronAPI.staffCreateMany(staff);
}

export function update(id, patch) {
    return window.electronAPI.staffUpdate(id, patch);
}

export function remove(id) {
    return window.electronAPI.staffRemove(id);
}

export function removeMany(ids) {
    return window.electronAPI.staffRemoveMany(ids);
}
