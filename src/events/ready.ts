import { Events, Client } from 'discord.js';
import { DatabaseConfig } from '../config/database';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: Client<true>) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    try {
        await DatabaseConfig.getInstance(); // Initialize the DB connection on bot startup
    } catch (err) {
        console.error('Failed to connect to SQLite database:', err);
    }
}
