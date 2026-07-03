import { app, BrowserWindow, ipcMain } from 'electron'
import fileService from './services/fileService.js'
import path from 'path'
import { fileURLToPath } from 'url';
import xlsxService from './services/xlsxService.js';
import LicenseService from './services/licenseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isInDev = process.env.NODE_ENV === 'development'
const files = new fileService()
const xlsx = new xlsxService()
const license = new LicenseService()

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: isInDev
        },
    })

    if (isInDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    }
    else
        win.loadFile(path.join(__dirname, '../../dist/index.html'))
}

app.whenReady().then(async () => {

    //create default files
    await files.ensureDefaultFiles()

    // File Service
    ipcMain.handle('read-json', (event, path) => files.readJsonData(path))
    ipcMain.handle('write-json', (event, path, data) => files.writeJsonData(path, data))
    ipcMain.handle('modify-json', (event, path, data) => files.modifyJsonData(path, data))

    //XLSX Service
    ipcMain.handle('import-file', (event) => xlsx.importFile())
    ipcMain.handle('export-file', (event, data, filePath) => xlsx.exportFile(data, filePath))

    //License Service
    ipcMain.handle('check-license', (event, code) => {
        const isValid = license.verifyLicense(code)
        if (!isValid) {
            return { valid: false }
        }
        return {
            valid: true,
            code: code,
            date: license.getExpirationDate(code)
        }
    })

    createWindow()
})

