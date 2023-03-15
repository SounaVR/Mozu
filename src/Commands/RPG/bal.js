module.exports = {
    data: {
        name: "balance",
        description: "Display your balance.",
        nameLocalizations: {
            fr: "solde"
        },
        descriptionLocalizations: {
            fr: "Affiche votre solde."
        }
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const player = await client.getPlayer(client.connection, interaction.user.id);

        interaction.reply(`💳 ► ${client.translate(player.data.lang, 'bal.actualBal', `**${client.nFormatter(player.data.money)}**${client.Emotes.cash}`)}`);
    }
}
