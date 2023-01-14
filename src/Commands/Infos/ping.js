const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client, interaction) {
		await interaction.deferReply('Ping ?');
        await interaction.editReply(`
            🏓P${'o'.repeat(Math.min(Math.round(client.ws.ping / 100), 1500))}ng!\nAverage ping of all WebSocketShards ► ${Math.round(client.ws.ping)}ms.
        `);
	},
};