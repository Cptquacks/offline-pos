const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    readJSON: (filePath) => ipcRenderer.invoke('read-json', filePath),
    writeJSON: (filePath, data) => ipcRenderer.invoke('write-json', filePath, data),
    modifyJSON: (filePath, data) => ipcRenderer.invoke('modify-json', filePath, data),
})