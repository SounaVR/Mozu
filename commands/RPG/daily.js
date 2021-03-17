const Default = require('../../utils/default.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    if (player.data.LastDaily == "0") {
        con.query(`UPDATE data SET daily = ${player.data.daily + Number(1)}, LastDaily = 1, money = ${player.data.money + Number(300)} WHERE userid = ${message.author.id}`);
        return message.reply(`${lang.daily.done}`);
    } else if (player.data.LastDaily == "1") {
        return message.reply(`${lang.daily.notNow}`);
    }
};

exports.help = {
    name: "daily",
    description_fr: "Collecte de l'argent tout les jours à 00h00",
    description_en: "Collecting money every day at 00h00 (Paris time zone)",
    category: "RPG",
    aliases: ["dai", "dl"]
};
