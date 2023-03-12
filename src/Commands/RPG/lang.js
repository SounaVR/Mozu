const { ApplicationCommandOptionType } = require("discord.js");
const Default = require("../../../utils/default.json");

module.exports = {
    data: {
        name: "lang",
        description: "Change your displayed game language",
        descriptionLocalizations: {
            fr: "Change votre langue de jeu affichée"
        },
        options: [
            {
                name: "lang",
                description: "Click on the desired language",
                descriptionLocalizations: {
                    fr: "Cliquez sur la langue désirée"
                },
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'FR', value: 'fr' },
                    { name: 'EN', value: 'en' }
                ]
            }
        ]
    },
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