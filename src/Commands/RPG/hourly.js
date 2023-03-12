const ms      = require("parse-ms"),
    Default   = require("../../../utils/default.json"),
    Emotes    = require("../../../utils/emotes.json");

module.exports = {
    data: {
        name: "hr",
        description: "Collect money every hours",
        descriptionLocalizations: {
            fr: "Collecte de l'argent toutes les heures"
        }
    },
    async execute(client, interaction) {
        const con = client.connection;
        const player = await client.getPlayer(con, interaction.user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);
        let cooldown = 3600000;
        const energy = Math.ceil(Math.random() * 15)+5;

        if (player.data.lastHR !== null && cooldown - (Date.now() - player.data.lastHR) > 0) {
            let timeObj = ms(cooldown - (Date.now() -  player.data.lastHR));
        
            return interaction.reply(`${lang.hr.notNow.replace("%s", `**${timeObj.minutes}m${timeObj.seconds}sec**`)} !`);
        } else {
            con.query(`UPDATE data SET lastHR = ${Date.now()}, money = ${player.data.money + Number(30)} WHERE userid = ${interaction.user.id}`);
            con.query(`UPDATE ress SET energy = ${player.ress.energy + Number(energy)} WHERE userid = ${interaction.user.id}`);
            con.query(`UPDATE stats SET HR = ${player.stats.HR + Number(1)} WHERE userid = ${interaction.user.id}`);

            return interaction.reply(`${lang.hr.done.replace("%s", `${energy} ${Emotes.energy}`)}`);
        }
    }
}