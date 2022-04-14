const Default = require("../../../utils/default.json");

module.exports = {
    name: 'lang',
    description: 'Choississez une langue',
    options: [
        {
            name: 'langue',
            description: 'Cliquez sur la langue voulue.',
            type: 'STRING',
            required: true,
            choices : [
                {
                    name: 'FR',
                    value: 'fr'
                },
                {
                    name: 'EN',
                    value: 'en'
                }
            ]
        }
    ],
    async execute(client, interaction, getPlayer) {
        const { user, options } = interaction;
        const choice = options.getString('langue');

        const con = client.connection;
        var player = await getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);

        con.query(`UPDATE data SET lang = "${choice}" WHERE userid = ${user.id}`);
        var player = await getPlayer(con, user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);
        return interaction.reply(lang.confirmLanguage.replace("%s", `\`${choice}\``));
    }
}