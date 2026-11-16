import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, closeDb } from './services/dbService.js';
import fileService from './services/fileService.js';
import xlsxService from './services/xlsxService.js';
import LicenseService from './services/licenseService.js';
import * as productsRepository from './repositories/productsRepository.js';
import * as staffRepository from './repositories/staffRepository.js';
import * as providersRepository from './repositories/providersRepository.js';
import * as tagsRepository from './repositories/tagsRepository.js';
import * as notesRepository from './repositories/notesRepository.js';
import * as tracesRepository from './repositories/tracesRepository.js';
import * as ticketsRepository from './repositories/ticketsRepository.js';

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
        await files.ensureDefaultFiles();
        const xlsx = new xlsxService();
        const license = new LicenseService();

        // Handlers JSON temporales (mientras migras)
        ipcMain.handle('read-json', (e, p) => files.readJsonData(p));
        ipcMain.handle('write-json', (e, p, d) => files.writeJsonData(p, d));
        ipcMain.handle('modify-json', (e, p, d) => files.modifyJsonData(p, d));

        // Product Repository
        ipcMain.handle('products-list-all', (e, withRelations) => productsRepository.listAll(withRelations));
        ipcMain.handle('products-create', (e, product) => productsRepository.create(product));
        ipcMain.handle('products-create-many', (e, products) => productsRepository.createMany(products));
        ipcMain.handle('products-update', (e, id, patch) => productsRepository.update(id, patch));
        ipcMain.handle('products-remove', (e, id) => productsRepository.remove(id));
        ipcMain.handle('products-remove-many', (e, ids) => productsRepository.removeMany(ids));

        ipcMain.handle('products-list', (e, withRelations, limit) => productsRepository.list(withRelations, limit));
        ipcMain.handle('products-find-by-id', (e, id, withRelations) => productsRepository.findById(id, withRelations));
        ipcMain.handle('products-find-by-name', (e, name, withRelations) => productsRepository.findByName(name, withRelations));
        ipcMain.handle('products-find-by-category', (e, category, withRelations) => productsRepository.findByCategory(category, withRelations));
        ipcMain.handle('products-low-stock', (e, threshold, withRelations) => productsRepository.lowStock(threshold, withRelations));
        ipcMain.handle('products-adjust-stock', (e, id, adjustment) => productsRepository.adjustStock(id, adjustment));

        ipcMain.handle('staff-list-all', (e, withRelations) => staffRepository.listAll(withRelations));
        ipcMain.handle('staff-create', (e, staff) => staffRepository.create(staff));
        ipcMain.handle('staff-create-many', (e, staff) => staffRepository.createMany(staff));
        ipcMain.handle('staff-update', (e, id, patch) => staffRepository.update(id, patch));
        ipcMain.handle('staff-remove', (e, id) => staffRepository.remove(id));
        ipcMain.handle('staff-remove-many', (e, ids) => staffRepository.removeMany(ids));

        ipcMain.handle('providers-list-all', (e, withRelations) => providersRepository.listAll(withRelations));
        ipcMain.handle('providers-create', (e, provider) => providersRepository.create(provider));
        ipcMain.handle('providers-create-many', (e, providers) => providersRepository.createMany(providers));
        ipcMain.handle('providers-update', (e, id, patch) => providersRepository.update(id, patch));
        ipcMain.handle('providers-remove', (e, id) => providersRepository.remove(id));
        ipcMain.handle('providers-remove-many', (e, ids) => providersRepository.removeMany(ids));

        ipcMain.handle('tags-list-by-type', (e, type) => tagsRepository.listByType(type));
        ipcMain.handle('tags-create', (e, tag) => tagsRepository.create(tag));
        ipcMain.handle('tags-update', (e, id, patch) => tagsRepository.update(id, patch));
        ipcMain.handle('tags-remove-many', (e, ids) => tagsRepository.removeMany(ids));

        ipcMain.handle('notes-create', (e, ownerType, ownerId, note) => notesRepository.create(ownerType, ownerId, note));
        ipcMain.handle('notes-remove', (e, id) => notesRepository.remove(id));

        ipcMain.handle('traces-list-all', (e, withRelations) => tracesRepository.listAll(withRelations));
        ipcMain.handle('traces-get-or-create-today', () => tracesRepository.getOrCreateToday());
        ipcMain.handle('traces-create', (e, trace) => tracesRepository.create(trace));
        ipcMain.handle('traces-update', (e, id, patch) => tracesRepository.update(id, patch));
        ipcMain.handle('traces-close', (e, id) => tracesRepository.close(id));
        ipcMain.handle('traces-upsert-manual-many', (e, entries) => tracesRepository.upsertManualMany(entries));

        ipcMain.handle('tickets-list-all', () => ticketsRepository.listAll());
        ipcMain.handle('tickets-create-sale', (e, items) => ticketsRepository.createSale(items));
        ipcMain.handle('tickets-create-refund', (e, productId, amount) => ticketsRepository.createRefund(productId, amount));
        ipcMain.handle('tickets-archive-all', () => ticketsRepository.archiveAll());

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