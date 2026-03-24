import { Events, Interaction } from 'discord.js';
import { handleCommandError } from '../errors/errorHandler';

export const name = Events.InteractionCreate;

export async function execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    console.log(`\n[DEBUG] Interaction received for /${interaction.commandName} at ${new Date().toISOString()}`);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        await handleCommandError(error, interaction);
    }
}
