"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const repository_1 = require("../../database/repository");
const userRepo = new repository_1.Repository('users');
const pingCommand = {
    data: new discord_js_1.SlashCommandBuilder()
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
        }
        else {
            user = { id: userId, username, ping_count: 1 };
            await userRepo.create(user);
        }
        await interaction.editReply(`Pong! You have pinged me ${user.ping_count} times!`);
    },
};
exports.default = pingCommand;
module.exports = pingCommand;
