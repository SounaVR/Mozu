const { CommandInteraction } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Affiche la latence du bot",
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        interaction.reply({ content: `${client.ws.ping}ms.` })
    }
}