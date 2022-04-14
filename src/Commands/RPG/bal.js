const { nFormatter, translate } = require('../../../utils/u');
const Emotes = require("../../../utils/emotes.json");
const Default = require('../../../utils/default.json');

module.exports = {
    name: 'balance',
    description: 'Affiche votre solde',
    async execute(client, interaction) {
        const { user } = interaction;

        const con = client.connection;
        const player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);

        interaction.reply(`💳 ► ${translate(player.data.lang, 'bal.actualBal', `**${nFormatter(player.data.money)}**${Emotes.cash}`)}`);
    }
}
