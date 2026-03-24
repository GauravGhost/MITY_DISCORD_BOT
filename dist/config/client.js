"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("../types/discord"); // Augments Discord typings
/**
 * Singleton-like module export for the Discord Client.
 * This allows you to import `client` from anywhere in your project to interact with Discord.
 */
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
client.commands = new discord_js_1.Collection();
exports.default = client;
