const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {

    // File Service
    readJSON: (filePath) => ipcRenderer.invoke('read-json', filePath),
    writeJSON: (filePath, data) => ipcRenderer.invoke('write-json', filePath, data),
    modifyJSON: (filePath, data) => ipcRenderer.invoke('modify-json', filePath, data),

    // XLSX Service
    importFile: () => ipcRenderer.invoke('import-file'),
    exportFile: (data, filePath) => ipcRenderer.invoke('export-file', data, filePath),

    //Date Service
    getToday: () => ipcRenderer.invoke('get-today'),
    daysBetween: (a, b) => ipcRenderer.invoke('days-between', a, b),
    daysFromToday: (target) => ipcRenderer.invoke('days-from-today', target),
    addDays: (dateStr, days) => ipcRenderer.invoke('add-days', dateStr, days),
    normalizeExcelDate: (excelDateStr) => ipcRenderer.invoke('normalize-excel-date', excelDateStr),

    //License Service
    checkLicense: (code) => ipcRenderer.invoke('check-license', code)
})