"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = exports.name = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const database_1 = require("../config/database");
exports.name = discord_js_1.Events.ClientReady;
exports.once = true;
async function execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    try {
        await database_1.DatabaseConfig.getInstance(); // Initialize the DB connection on bot startup
    }
    catch (err) {
        console.error('Failed to connect to SQLite database:', err);
    }
}
