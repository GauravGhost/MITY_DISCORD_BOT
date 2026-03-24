"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const node_path_1 = __importDefault(require("node:path"));
/**
 * Singleton class to manage the SQLite Database connection.
 */
class DatabaseConfig {
    static instance = null;
    constructor() { } // Prevent direct instantiation
    static async getInstance() {
        if (!DatabaseConfig.instance) {
            if (process.env.NODE_ENV !== 'production') {
                sqlite3_1.default.verbose();
            }
            DatabaseConfig.instance = await (0, sqlite_1.open)({
                filename: node_path_1.default.join(__dirname, '../../database.sqlite'),
                driver: sqlite3_1.default.Database
            });
            await DatabaseConfig.initTables(DatabaseConfig.instance);
        }
        return DatabaseConfig.instance;
    }
    /**
     * Executes the given callback inside a SQLite Transaction.
     * Automatically commits if successful, and rolls back if an error is thrown.
     *
     * Usage:
     * await DatabaseConfig.transaction(async () => {
     *     await userRepo.create(...);
     *     await userRepo.update(...);
     * });
     */
    static async transaction(callback) {
        const db = await this.getInstance();
        await db.run('BEGIN TRANSACTION');
        try {
            const result = await callback();
            await db.run('COMMIT');
            return result;
        }
        catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    }
    static async initTables(db) {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                ping_count INTEGER DEFAULT 0
            );
        `);
        console.log('[DB] SQLite Database connected and tables ensured via Singleton config.');
    }
}
exports.DatabaseConfig = DatabaseConfig;
