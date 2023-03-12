const Default = require("../../../utils/default.json"),
Emotes        = require("../../../utils/emotes.json");

module.exports = {
    data: {
        name: "daily",
        description: "Collect money every day at midnight (UTC+1)",
        descriptionLocalizations: {
            fr: "Collecte de l\'argent tout les jours à 00h00"
        }
    },
    async execute(client, interaction) {
        const con = client.connection;
        const player = await client.getPlayer(con, interaction.user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);

        if (player.data.lastDaily == 0) {
            con.query(`UPDATE data SET lastDaily = 1, money = ${player.data.money + Number(300)} WHERE userid = ${interaction.user.id}`);
            con.query(`UPDATE stats SET daily = ${player.stats.daily + Number(1)} WHERE userid = ${interaction.user.id}`);
            return interaction.reply(`${lang.daily.done.replace("%s", `300 ${Emotes.cash}`)}`);
        } else if (player.data.lastDaily == 1) {
            return interaction.reply(`${lang.daily.notNow.replace("%s", "00h00")}`);
        }
    }
}