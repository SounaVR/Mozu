const Default = require('../../utils/default.json');

exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    switch(player.data.daily) {
        case "0":
            con.query(`UPDATE data SET daily = ${player.data.LastDaily + Number(1)}, LastDaily = 1, money = ${player.data.money + Number(300)} WHERE userid = ${message.author.id}`)
            message.reply(`${lang.daily.done}`)
            break;
        case "1":
            message.reply(`${lang.daily.notnow}`)
            break;
    }
};

exports.help = {
    name: "daily",
    description_fr: "Collecte de l'argent tout les jours à 00h00",
    description_en: "Collecting money every day at 00h00 (Paris time zone)",
    category: "RPG",
    aliases: ["dai", "dl"]
};
