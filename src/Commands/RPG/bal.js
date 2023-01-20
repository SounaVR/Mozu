const { SlashCommandBuilder } = require('discord.js');
const { nFormatter, translate } = require('../../../utils/u');
const Emotes = require("../../../utils/emotes.json");
const Default = require('../../../utils/default.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Display your balance.")
		.setNameLocalizations({
            fr: "solde",
            "en-US": "balance"
        })
        .setDescriptionLocalizations({
            fr: "Affiche votre solde.",
            "en-US": "Display your balance."
        }),
    async execute(client, interaction) {
        const { user } = interaction;

        const con = client.connection;
        const player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);

        interaction.reply(`💳 ► ${translate(player.data.lang, 'bal.actualBal', `**${nFormatter(player.data.money)}**${Emotes.cash}`)}`);
    }
}
