const Default = require('../../../utils/default.json');

module.exports = {
    name: 'rep',
    description: 'Donne un point de réputation à un joueur',
    options: [
        {
            name: 'membre',
            description: 'Sélectionnez un utilisateur.',
            type: 'USER',
            required: true
        }
    ],
    async execute (client, interaction, getPlayer, getUser) {
        const { options } = interaction;
        const target = options.getMember('membre');
        
        const con = client.connection
        const player = await getPlayer(con, interaction.user.id);
        const user = await getUser(con, target.id);
        if (!player) return interaction.reply(Default.notRegistered);
        if (!user) return interaction.reply(Default.targetNotRegistered);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        if (player.data.lastRep === 1) {
            return interaction.reply(`${lang.rep.notNow.replace("%s", "00h00")}`);
        } else if (player.data.lastRep === 0) {
            con.query(`UPDATE data SET lastRep = 1 WHERE userid = ${interaction.user.id}`);
            con.query(`UPDATE stats SET rep = ${user.stats.rep + Number(1)} WHERE userid = ${target.id}`);
            return interaction.reply(`${interaction.user} - ${lang.rep.done.replace("%s", `${target}`)}`);
        }
    }
}