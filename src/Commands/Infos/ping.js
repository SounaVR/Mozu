module.exports = {
	data: {
		name: "ping",
		description: "Replies with the websocket latency",
		descriptionLocalizations: {
			fr: "Affiche la latence des websockets"
		}
	},
	async execute(client, interaction) {
		await interaction.deferReply('Ping ?');
        await interaction.editReply(`
            🏓P${'o'.repeat(Math.min(Math.round(client.ws.ping / 100), 1500))}ng!\nAverage ping of all WebSocketShards ► ${Math.round(client.ws.ping)}ms.
        `);
	},
};