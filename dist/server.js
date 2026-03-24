"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("./config/config");
const client_1 = __importDefault(require("./config/client"));
const errorHandler_1 = require("./errors/errorHandler");
// Ensure the bot doesn't crash from random node errors
(0, errorHandler_1.setupProcessErrorHandlers)();
// Dynamically load commands
const foldersPath = node_path_1.default.join(__dirname, 'commands');
if (node_fs_1.default.existsSync(foldersPath)) {
    const commandFolders = node_fs_1.default.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = node_path_1.default.join(foldersPath, folder);
        if (node_fs_1.default.statSync(commandsPath).isDirectory()) {
            const commandFiles = node_fs_1.default.readdirSync(commandsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = node_path_1.default.join(commandsPath, file);
                const exportedModule = require(filePath);
                const command = exportedModule.default || exportedModule;
                if ('data' in command && 'execute' in command) {
                    client_1.default.commands.set(command.data.name, command);
                }
                else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }
}
else {
    console.log(`[WARNING] The commands folder at ${foldersPath} does not exist. Skipping command loading.`);
}
// Dynamically load events
const eventsPath = node_path_1.default.join(__dirname, 'events');
if (node_fs_1.default.existsSync(eventsPath)) {
    const eventFiles = node_fs_1.default.readdirSync(eventsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = node_path_1.default.join(eventsPath, file);
        const exportedModule = require(filePath);
        const event = exportedModule.default || exportedModule;
        if (event.once) {
            client_1.default.once(event.name, (...args) => event.execute(...args));
        }
        else {
            client_1.default.on(event.name, (...args) => event.execute(...args));
        }
    }
}
else {
    console.log(`[WARNING] The events folder at ${eventsPath} does not exist. Skipping event loading.`);
}
client_1.default.login(config_1.config.BOT_TOKEN);
