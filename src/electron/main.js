import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import fileService from './services/fileService.js';
import xlsxService from './services/xlsxService.js';
import LicenseService from './services/licenseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isInDev = process.env.NODE_ENV === 'development';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

let db;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'), // CJS si sandbox activo
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
        const dbPath = path.join(app.getPath('userData'), 'kepler.db');
        db = new Database(dbPath);
        db.pragma('journal_mode = WAL');
        db.pragma('synchronous = NORMAL');
        db.pragma('foreign_keys = ON');
        db.pragma('busy_timeout = 5000');

        // TODO: migración de esquema aquí (reemplaza ensureDefaultFiles)
        // await migrateSchema(db);

        const files = new fileService();
        const xlsx = new xlsxService();
        const license = new LicenseService();

        // Handlers JSON temporales (mientras migras)
        ipcMain.handle('read-json', (e, p) => files.readJsonData(p));
        ipcMain.handle('write-json', (e, p, d) => files.writeJsonData(p, d));
        ipcMain.handle('modify-json', (e, p, d) => files.modifyJsonData(p, d));

        ipcMain.handle('import-file', () => xlsx.importFile());
        ipcMain.handle('export-file', (e, data, fp) => xlsx.exportFile(data, fp));

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

app.on('before-quit', () => {
    if (db) db.close();
});