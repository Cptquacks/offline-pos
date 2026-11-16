export function listAll() {
    return window.electronAPI.ticketsListAll();
}

export function createSale(items) {
    return window.electronAPI.ticketsCreateSale(items);
}

export function createRefund(productId, amount) {
    return window.electronAPI.ticketsCreateRefund(productId, amount);
}

export function archiveAll() {
    return window.electronAPI.ticketsArchiveAll();
}
