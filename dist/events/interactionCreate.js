"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const errorHandler_1 = require("../errors/errorHandler");
exports.name = discord_js_1.Events.InteractionCreate;
async function execute(interaction) {
    if (!interaction.isChatInputCommand())
        return;
    console.log(`\n[DEBUG] Interaction received for /${interaction.commandName} at ${new Date().toISOString()}`);
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        await (0, errorHandler_1.handleCommandError)(error, interaction);
    }
}
