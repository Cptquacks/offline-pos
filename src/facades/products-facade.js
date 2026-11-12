export function listAll(withRelations) {
    return window.electronAPI.productsListAll(withRelations);
}

export function list(withRelations, limit) {
    return window.electronAPI.productsList(withRelations, limit);
}

export function findById(id, withRelations) {
    return window.electronAPI.productsFindById(id, withRelations);
}

export function findByName(name, withRelations) {
    return window.electronAPI.productsFindByName(name, withRelations);
}

export function findByCategory(category, withRelations) {
    return window.electronAPI.productsFindByCategory(category, withRelations);
}

export function lowStock(threshold, withRelations) {
    return window.electronAPI.productsLowStock(threshold, withRelations);
}

export function adjustStock(id, adjustment) {
    return window.electronAPI.productsAdjustStock(id, adjustment);
}

export function create(product) {
    return window.electronAPI.productsCreate(product);
}

export function createMany(products) {
    return window.electronAPI.productsCreateMany(products);
}

export function update(id, patch) {
    return window.electronAPI.productsUpdate(id, patch);
}

export function remove(id) {
    return window.electronAPI.productsRemove(id);
}

export function removeMany(ids) {
    return window.electronAPI.productsRemoveMany(ids);
}
