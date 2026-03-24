import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { Repository } from '../../database/repository';

interface UserData {
    id: string;
    username: string;
    ping_count: number;
}

const userRepo = new Repository<UserData>('users');

const pingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong and updates your ping count in the database!'),
    async execute(interaction) {
        await interaction.deferReply();
        
        const userId = interaction.user.id;
        const username = interaction.user.username;

        let user = await userRepo.findById(userId);

        if (user) {
            user.ping_count += 1;
            user.username = username;
            await userRepo.update(userId, { ping_count: user.ping_count, username });
        } else {
            user = { id: userId, username, ping_count: 1 };
            await userRepo.create(user);
        }

        await interaction.editReply(`Pong! You have pinged me ${user.ping_count} times!`);
    },
};

export default pingCommand;
module.exports = pingCommand;
