import { app, BrowserWindow, ipcMain } from 'electron'
import fileService from './services/fileService.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isInDev = process.env.NODE_ENV === 'development'
const files = new fileService()

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // 👈 Ruta a tu script
            contextIsolation: true, // ¡Mantenlo siempre en true!
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
    ipcMain.handle('read-json', (event, path) => files.readJsonData(path))
    ipcMain.handle('write-json', (event, path, data) => files.writeJsonData(path, data))
    createWindow()
})

