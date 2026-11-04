const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {

    // File Service
    readJSON: (filePath) => ipcRenderer.invoke('read-json', filePath),
    writeJSON: (filePath, data) => ipcRenderer.invoke('write-json', filePath, data),
    modifyJSON: (filePath, data) => ipcRenderer.invoke('modify-json', filePath, data),

    // XLSX Service
    importFile: () => ipcRenderer.invoke('import-file'),
    exportFile: (data, filePath) => ipcRenderer.invoke('export-file', data, filePath),

    //License Service
    checkLicense: (code) => ipcRenderer.invoke('check-license', code)
})