const { ApplicationCommandOptionType } = require("discord.js");
const Default = require('../../utils/default.json');

module.exports = {
    data: {
        name: "rep",
        description: "Gives a reputation point to a player",
        descriptionLocalizations: {
            fr: "Donne un point de réputation à un joueur"
        },
        options: [
            {
                name: "member",
                description: "Select a user",
                descriptionLocalizations: "Sélectionnez un utilisateur",
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    async execute (client, interaction) {
        const { options } = interaction;
        const target = options.getMember('member');

        const player = await client.getPlayer(interaction.user.id);
        const user = await client.getPlayer(target.id);
        if (!user) return interaction.reply(Default.targetNotRegistered);

        if (target.id === interaction.user.id) return interaction.reply(client.translate(player.data.lang, 'rep.giveToSelf'));

        switch (player.data.lastRep) {
            case 0:
                client.query(`UPDATE data SET lastRep = 1 WHERE userid = ${interaction.user.id}`);
                client.query(`UPDATE stats SET rep = ${user.stats.rep + Number(1)} WHERE userid = ${target.id}`);
                interaction.reply(`${interaction.user} - ${client.translate(player.data.lang, 'rep.done', target)}`);
                break;

            case 1:
                interaction.reply(client.translate(player.data.lang, 'rep.notNow', '**00h00 (UTC+1)**'));
                break;
        }
    }
}