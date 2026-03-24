import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'node:path';

/**
 * Singleton class to manage the SQLite Database connection.
 */
export class DatabaseConfig {
    private static instance: Database | null = null;

    private constructor() {} // Prevent direct instantiation

    public static async getInstance(): Promise<Database> {
        if (!DatabaseConfig.instance) {
            if (process.env.NODE_ENV !== 'production') {
                sqlite3.verbose();
            }

            DatabaseConfig.instance = await open({
                filename: path.join(__dirname, '../../database.sqlite'),
                driver: sqlite3.Database
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
    public static async transaction<T>(callback: () => Promise<T>): Promise<T> {
        const db = await this.getInstance();
        await db.run('BEGIN TRANSACTION');
        try {
            const result = await callback();
            await db.run('COMMIT');
            return result;
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    }

    private static async initTables(db: Database) {
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
