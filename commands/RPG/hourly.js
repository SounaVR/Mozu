const ms      = require("parse-ms"),
    Default   = require("../../utils/default.json");

exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    let userid = message.author.id;
    let cooldown = 3600000;

    if (player.data.lastHR !== null && cooldown - (Date.now() - player.data.lastHR) > 0) {
    let timeObj = ms(cooldown - (Date.now() -  player.data.lastHR));

    return message.reply(`${lang.hr.notNow} **${timeObj.minutes}m${timeObj.seconds}sec** !`);
    } else {
        con.query(`UPDATE data SET lastHR = ${Date.now()}, money = ${player.data.money + Number(30)} WHERE userid = ${userid}`);

        return message.reply(`${lang.hr.done}`);
    }
};

exports.help = {
    name: "hourly",
    description_fr: "Collecte de l'argent toutes les heures",
    description_en: "Collecting money every hour",
    category: "RPG",
    aliases: ["hr"]
};
