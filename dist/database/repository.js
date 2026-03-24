"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const database_1 = require("../config/database");
/**
 * A generic class to handle basic SQLite CRUD operations.
 */
class Repository {
    tableName;
    constructor(tableName) {
        this.tableName = tableName;
    }
    /**
     * Insert a new record into the table.
     */
    async create(data) {
        const db = await database_1.DatabaseConfig.getInstance();
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');
        await db.run(`INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`, values);
    }
    /**
     * Find a single record by its ID.
     */
    async findById(id) {
        const db = await database_1.DatabaseConfig.getInstance();
        return db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    }
    /**
     * Find a single record that matches the given filter.
     */
    async findOne(filter) {
        const db = await database_1.DatabaseConfig.getInstance();
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
    async find(filter = {}) {
        const db = await database_1.DatabaseConfig.getInstance();
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
    async update(id, data) {
        const db = await database_1.DatabaseConfig.getInstance();
        const keys = Object.keys(data);
        if (keys.length === 0)
            return;
        const values = Object.values(data);
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        await db.run(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`, [...values, id]);
    }
    /**
     * Deletes a record by its ID.
     */
    async delete(id) {
        const db = await database_1.DatabaseConfig.getInstance();
        await db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    }
}
exports.Repository = Repository;
