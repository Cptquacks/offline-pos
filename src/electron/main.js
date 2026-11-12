import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, closeDb } from './services/dbService.js';
import fileService from './services/fileService.js';
import xlsxService from './services/xlsxService.js';
import LicenseService from './services/licenseService.js';
import {
    listAll as productsListAll,
    create as productsCreate,
    createMany as productsCreateMany,
    update as productsUpdate,
    remove as productsRemove,
    removeMany as productsRemoveMany,
    list as productsList,
    findById as productsFindById,
    findByName as productsFindByName,
    findByCategory as productsFindByCategory,
    lowStock,
    adjustStock
} from './repositories/productsRepository.js';

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
        const license = new LicenseService();

        // Handlers JSON temporales (mientras migras)
        ipcMain.handle('read-json', (e, p) => files.readJsonData(p));
        ipcMain.handle('write-json', (e, p, d) => files.writeJsonData(p, d));
        ipcMain.handle('modify-json', (e, p, d) => files.modifyJsonData(p, d));

        // Product Repository
        ipcMain.handle('products-list-all', (e, withRelations) => productsListAll(withRelations));
        ipcMain.handle('products-create', (e, product) => productsCreate(product));
        ipcMain.handle('products-create-many', (e, products) => productsCreateMany(products));
        ipcMain.handle('products-update', (e, id, patch) => productsUpdate(id, patch));
        ipcMain.handle('products-remove', (e, id) => productsRemove(id));
        ipcMain.handle('products-remove-many', (e, ids) => productsRemoveMany(ids));

        ipcMain.handle('products-list', (e, withRelations, limit) => productsList(withRelations, limit));
        ipcMain.handle('products-find-by-id', (e, id, withRelations) => productsFindById(id, withRelations));
        ipcMain.handle('products-find-by-name', (e, name, withRelations) => productsFindByName(name, withRelations));
        ipcMain.handle('products-find-by-category', (e, category, withRelations) => productsFindByCategory(category, withRelations));
        ipcMain.handle('products-low-stock', (e, threshold, withRelations) => lowStock(threshold, withRelations));
        ipcMain.handle('products-adjust-stock', (e, id, adjustment) => adjustStock(id, adjustment));

        // XLSX Service
        ipcMain.handle('import-file', () => xlsx.importFile());
        ipcMain.handle('export-file', (e, data, fp) => xlsx.exportFile(data, fp));

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