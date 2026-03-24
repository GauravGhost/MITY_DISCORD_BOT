import { DatabaseConfig } from '../config/database';

/**
 * A generic class to handle basic SQLite CRUD operations.
 */
export class Repository<T extends { id?: string | number }> {
    constructor(private tableName: string) {}

    /**
     * Insert a new record into the table.
     */
    async create(data: Partial<T>): Promise<void> {
        const db = await DatabaseConfig.getInstance();
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');
        
        await db.run(
            `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
            values
        );
    }

    /**
     * Find a single record by its ID.
     */
    async findById(id: string | number): Promise<T | undefined> {
        const db = await DatabaseConfig.getInstance();
        return db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    }

    /**
     * Find a single record that matches the given filter.
     */
    async findOne(filter: Partial<T>): Promise<T | undefined> {
        const db = await DatabaseConfig.getInstance();
        const keys = Object.keys(filter);
        if (keys.length === 0) {
            return db.get(`SELECT * FROM ${this.tableName} LIMIT 1`);
        }
        
        const values = Object.values(filter);
        const whereClause = keys.map(k => `${k} = ?`).join(' AND ');

        return db.get(`SELECT * FROM ${this.tableName} WHERE ${whereClause}`, values);
    }

    /**
     * Find all records that match the given filter. 
     * If no filter is provided, returns all records.
     */
    async find(filter: Partial<T> = {}): Promise<T[]> {
        const db = await DatabaseConfig.getInstance();
        const keys = Object.keys(filter);
        if (keys.length === 0) {
            return db.all(`SELECT * FROM ${this.tableName}`);
        }
        
        const values = Object.values(filter);
        const whereClause = keys.map(k => `${k} = ?`).join(' AND ');

        return db.all(`SELECT * FROM ${this.tableName} WHERE ${whereClause}`, values);
    }

    /**
     * Updates an existing record by its ID.
     */
    async update(id: string | number, data: Partial<T>): Promise<void> {
        const db = await DatabaseConfig.getInstance();
        const keys = Object.keys(data);
        if (keys.length === 0) return;

        const values = Object.values(data);
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        
        await db.run(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
    }

    /**
     * Deletes a record by its ID.
     */
    async delete(id: string | number): Promise<void> {
        const db = await DatabaseConfig.getInstance();
        await db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    }
}
