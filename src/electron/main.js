import { app, BrowserWindow, ipcMain } from 'electron'
import fileService from './services/fileService.js'
import path from 'path'
import { fileURLToPath } from 'url';
import xlsxService from './services/xlsxService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isInDev = process.env.NODE_ENV === 'development'
const files = new fileService()
const xlsx = new xlsxService()

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    if (isInDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    }
    else
        win.loadFile('./index.html')
}

app.whenReady().then(() => {
    // File Service
    ipcMain.handle('read-json', (event, path) => files.readJsonData(path))
    ipcMain.handle('write-json', (event, path, data) => files.writeJsonData(path, data))
    ipcMain.handle('modify-json', (event, path, data) => files.modifyJsonData(path, data))

    //XLSX Service
    ipcMain.handle('import-file', (event) => xlsx.importFile())
    ipcMain.handle('export-file', (event, data, filePath) => xlsx.exportFile(data, filePath))

    createWindow()
})

