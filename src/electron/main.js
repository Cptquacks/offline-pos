import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, closeDb } from './services/dbService.js';
import fileService from './services/fileService.js';
import xlsxService from './services/xlsxService.js';
import LicenseService from './services/licenseService.js';
import dateService from './services/dateService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isInDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: isInDev,
        },
    });
    if (isInDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
    }
};

app.whenReady()
    .then(async () => {
        initDb(); // abre conexión + Drizzle

        const files = new fileService();
        const xlsx = new xlsxService();
        const date = new dateService();
        const license = new LicenseService();

        // Handlers JSON temporales (mientras migras)
        ipcMain.handle('read-json', (e, p) => files.readJsonData(p));
        ipcMain.handle('write-json', (e, p, d) => files.writeJsonData(p, d));
        ipcMain.handle('modify-json', (e, p, d) => files.modifyJsonData(p, d));

        // XLSX Service
        ipcMain.handle('import-file', () => xlsx.importFile());
        ipcMain.handle('export-file', (e, data, fp) => xlsx.exportFile(data, fp));

        // Date Service
        ipcMain.handle('get-today', () => date.getToday());
        ipcMain.handle('days-between', (e, a, b) => date.daysBetween(a, b));
        ipcMain.handle('days-from-today', (e, target) => date.daysFromToday(target));
        ipcMain.handle('add-days', (e, dateStr, days) => date.addDays(dateStr, days));
        ipcMain.handle('normalize-excel-date', (e, excelDateStr) => date.normalizeExcelDate(excelDateStr));

        // License Service
        ipcMain.handle('check-license', (e, code) => {
            if (!license.verifyLicense(code)) return { valid: false };
            return { valid: true, code, date: license.getExpirationDate(code) };
        });

        createWindow();
    })
    .catch((err) => {
        console.error('Fallo al inicializar la app:', err);
        app.quit();
    });

app.on('before-quit', () => closeDb());