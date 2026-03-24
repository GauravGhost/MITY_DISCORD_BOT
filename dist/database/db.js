"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
// Enable verbose mode in development
if (process.env.NODE_ENV !== 'production') {
    sqlite3_1.default.verbose();
}
let dbInstance = null;
/**
 * Initializes and returns the SQLite database instance.
 */
async function getDb() {
    if (dbInstance) {
        return dbInstance;
    }
    dbInstance = await (0, sqlite_1.open)({
        filename: path_1.default.join(__dirname, '../../database.sqlite'),
        driver: sqlite3_1.default.Database
    });
    await initTables(dbInstance);
    return dbInstance;
}
/**
 * Creates required tables if they do not exist.
 */
async function initTables(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            ping_count INTEGER DEFAULT 0
        )
    `);
    console.log('[DB] SQLite Database connected and tables ensuring created.');
}
