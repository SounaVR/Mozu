const { SlashCommandBuilder, ApplicationCommandOptionType } = require("discord.js");
const Default = require("../../../utils/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lang")
        .setDescription("Change your displayed game language")
        .setDescriptionLocalizations({
            fr: "Change votre langue de jeu affichée"
        })
        .addStringOption(option =>
            option.setName("lang")
                .setDescription("Click on the desired language")
                .setDescriptionLocalizations({
                    fr: "Cliquez sur la langue désirée"
                })
                .setRequired(true)
                .addChoices(
                    { name: 'FR', value: 'fr' },
                    { name: 'EN', value: 'en' }
                )),
    async execute(client, interaction) {
        const { user, options } = interaction;
        const choice = options.getString('lang');

        const con = client.connection;
        var player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);

        con.query(`UPDATE data SET lang = "${choice}" WHERE userid = ${user.id}`);
        var player = await client.getPlayer(con, user.id);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);
        return interaction.reply(lang.confirmLanguage.replace("%s", `\`${choice}\``));
    }
}