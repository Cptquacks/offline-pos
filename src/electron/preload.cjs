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

    //License Service
    checkLicense: (code) => ipcRenderer.invoke('check-license', code)
})