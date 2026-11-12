import { app } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { relations } from '../db/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

let sqlite = null;
let db = null;

function resolveDbPath() {
    const base = app.getPath('userData');
    return path.join(base, app.isPackaged ? 'kepler.db' : 'kepler.dev.db');
}

function applyPragmas(connection) {
    connection.pragma('journal_mode = WAL');
    connection.pragma('synchronous = NORMAL');
    connection.pragma('foreign_keys = ON');
    connection.pragma('busy_timeout = 5000');
}

export function initDb() {
    if (db) return db;

    const dbPath = resolveDbPath();
    console.log('[db] Abriendo:', dbPath);

    sqlite = new Database(dbPath);
    applyPragmas(sqlite);

    db = drizzle({ client: sqlite, relations });

    const migrationsFolder = path.join(__dirname, '..', 'migrations');
    console.log('[db] Aplicando migraciones desde:', migrationsFolder);
    migrate(db, { migrationsFolder });

    return db;
}

export function getDb() {
    if (!db) throw new Error('[db] No inicializada. Llama a initDb() primero.');
    return db;
}

export function closeDb() {
    if (sqlite) {
        sqlite.close();
        sqlite = null;
        db = null;
    }
}

export function withTransaction(fn) {
    return getDb().transaction(fn);
}