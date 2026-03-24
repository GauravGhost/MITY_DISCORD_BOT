import { Interaction } from 'discord.js';
import { AppError, ClientError, InternalError } from './AppError';

/**
 * Global handler for any error thrown during a command execution.
 */
export async function handleCommandError(error: unknown, interaction: Interaction) {
    if (!interaction.isRepliable()) return;

    let replyMessage = 'An unexpected error occurred while processing your command.';
    let isEphemeral = true;

    // Check if it's a specially formatted custom error
    if (error instanceof AppError) {
        console.warn(`[AppError] ${error.name}: ${error.message}`);
        
        replyMessage = error.message;

        if (error instanceof InternalError) {
            console.error(error.stack);
            replyMessage = 'Internal system error occurred. Please try again later.';
        }
    } else {
        // Unhandled generic errors (e.g. database disconnect, null pointer)
        console.error('[Unhandled Command Error]', error);
    }

    try {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: replyMessage, ephemeral: isEphemeral });
        } else {
            await interaction.reply({ content: replyMessage, ephemeral: isEphemeral });
        }
    } catch (e) {
        console.error('Failed to send error fallback message to Discord:', e);
    }
}

/**
 * Hooks into the Node.js process to prevent unhandled rejections or uncaught exceptions from crashing the bot.
 */
export function setupProcessErrorHandlers() {
    process.on('uncaughtException', (error) => {
        console.error('[CRITICAL] Uncaught Exception:', error);
        // Do not cleanly exit by default unless it's fatal, 
        // to keep the bot alive as requested.
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
        // Same here, log it, but don't crash.
    });

    console.log('[Setup] Global process error handlers initialized.');
}
