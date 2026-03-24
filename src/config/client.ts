import { Client, Collection, GatewayIntentBits } from 'discord.js';
import '../types/discord'; // Augments Discord typings

/**
 * Singleton-like module export for the Discord Client.
 * This allows you to import `client` from anywhere in your project to interact with Discord.
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

export default client;
