const { ApplicationCommandOptionType } = require("discord.js");

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
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const choice = interaction.options.getString('lang');
        let player = await client.getPlayer(interaction.user.id);

        client.query(`UPDATE data SET lang = "${choice}" WHERE userid = ${interaction.user.id}`);
        player = await client.getPlayer(interaction.user.id);
        return interaction.reply(client.translate(player.data.lang, 'confirmLanguage', `\`${choice}\``));
    }
}