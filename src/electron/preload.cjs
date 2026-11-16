const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {

    // File Service
    readJSON: (filePath) => ipcRenderer.invoke('read-json', filePath),
    writeJSON: (filePath, data) => ipcRenderer.invoke('write-json', filePath, data),
    modifyJSON: (filePath, data) => ipcRenderer.invoke('modify-json', filePath, data),

    // XLSX Service
    importFile: () => ipcRenderer.invoke('import-file'),
    exportFile: (data, filePath) => ipcRenderer.invoke('export-file', data, filePath),

    // Product Repository
    productsListAll: (withRelations) => ipcRenderer.invoke('products-list-all', withRelations),
    productsCreate: (product) => ipcRenderer.invoke('products-create', product),
    productsCreateMany: (products) => ipcRenderer.invoke('products-create-many', products),
    productsUpdate: (id, patch) => ipcRenderer.invoke('products-update', id, patch),
    productsRemove: (id) => ipcRenderer.invoke('products-remove', id),
    productsRemoveMany: (ids) => ipcRenderer.invoke('products-remove-many', ids),

    productsList: (withRelations, limit) => ipcRenderer.invoke('products-list', withRelations, limit),
    productsFindById: (id, withRelations) => ipcRenderer.invoke('products-find-by-id', id, withRelations),
    productsFindByName: (name, withRelations) => ipcRenderer.invoke('products-find-by-name', name, withRelations),
    productsFindByCategory: (category, withRelations) => ipcRenderer.invoke('products-find-by-category', category, withRelations),
    productsLowStock: (threshold, withRelations) => ipcRenderer.invoke('products-low-stock', threshold, withRelations),
    productsAdjustStock: (id, adjustment) => ipcRenderer.invoke('products-adjust-stock', id, adjustment),

    staffListAll: (withRelations) => ipcRenderer.invoke('staff-list-all', withRelations),
    staffCreate: (staff) => ipcRenderer.invoke('staff-create', staff),
    staffCreateMany: (staff) => ipcRenderer.invoke('staff-create-many', staff),
    staffUpdate: (id, patch) => ipcRenderer.invoke('staff-update', id, patch),
    staffRemove: (id) => ipcRenderer.invoke('staff-remove', id),
    staffRemoveMany: (ids) => ipcRenderer.invoke('staff-remove-many', ids),

    providersListAll: (withRelations) => ipcRenderer.invoke('providers-list-all', withRelations),
    providersCreate: (provider) => ipcRenderer.invoke('providers-create', provider),
    providersCreateMany: (providers) => ipcRenderer.invoke('providers-create-many', providers),
    providersUpdate: (id, patch) => ipcRenderer.invoke('providers-update', id, patch),
    providersRemove: (id) => ipcRenderer.invoke('providers-remove', id),
    providersRemoveMany: (ids) => ipcRenderer.invoke('providers-remove-many', ids),

    tagsListByType: (type) => ipcRenderer.invoke('tags-list-by-type', type),
    tagsCreate: (tag) => ipcRenderer.invoke('tags-create', tag),
    tagsUpdate: (id, patch) => ipcRenderer.invoke('tags-update', id, patch),
    tagsRemoveMany: (ids) => ipcRenderer.invoke('tags-remove-many', ids),

    notesCreate: (ownerType, ownerId, note) => ipcRenderer.invoke('notes-create', ownerType, ownerId, note),
    notesRemove: (id) => ipcRenderer.invoke('notes-remove', id),

    tracesListAll: (withRelations) => ipcRenderer.invoke('traces-list-all', withRelations),
    tracesGetOrCreateToday: () => ipcRenderer.invoke('traces-get-or-create-today'),
    tracesCreate: (trace) => ipcRenderer.invoke('traces-create', trace),
    tracesUpdate: (id, patch) => ipcRenderer.invoke('traces-update', id, patch),
    tracesClose: (id) => ipcRenderer.invoke('traces-close', id),
    tracesUpsertManualMany: (entries) => ipcRenderer.invoke('traces-upsert-manual-many', entries),

    ticketsListAll: () => ipcRenderer.invoke('tickets-list-all'),
    ticketsCreateSale: (items) => ipcRenderer.invoke('tickets-create-sale', items),
    ticketsCreateRefund: (productId, amount) => ipcRenderer.invoke('tickets-create-refund', productId, amount),
    ticketsArchiveAll: () => ipcRenderer.invoke('tickets-archive-all'),

    //License Service
    checkLicense: (code) => ipcRenderer.invoke('check-license', code)
})