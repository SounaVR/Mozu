module.exports = {
    name: "ping",
    description: "Affiche la latence du bot",
    async execute(client, interaction) {
        await interaction.deferReply('Ping ?');
        await interaction.editReply(`
            P${'o'.repeat(Math.min(Math.round(client.ws.ping / 100), 1500))}ng!\nAPI Discord ► ${Math.round(client.ws.ping)}ms.
        `);
    }
}