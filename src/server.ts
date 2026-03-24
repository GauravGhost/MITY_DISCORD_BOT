import fs from 'node:fs';
import path from 'node:path';
import { config } from './config/config';
import client from './config/client';
import { setupProcessErrorHandlers } from './errors/errorHandler';

// Ensure the bot doesn't crash from random node errors
setupProcessErrorHandlers();

// Dynamically load commands
const foldersPath = path.join(__dirname, 'commands');
if (fs.existsSync(foldersPath)) {
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        if (fs.statSync(commandsPath).isDirectory()) {
            const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const exportedModule = require(filePath);
                const command = exportedModule.default || exportedModule;
                
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }
} else {
    console.log(`[WARNING] The commands folder at ${foldersPath} does not exist. Skipping command loading.`);
}

// Dynamically load events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const exportedModule = require(filePath);
        const event = exportedModule.default || exportedModule;
        
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
} else {
    console.log(`[WARNING] The events folder at ${eventsPath} does not exist. Skipping event loading.`);
}

client.login(config.BOT_TOKEN);