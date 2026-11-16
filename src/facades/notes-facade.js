export function create(ownerType, ownerId, note) {
    return window.electronAPI.notesCreate(ownerType, ownerId, note);
}

export function remove(id) {
    return window.electronAPI.notesRemove(id);
}
