const moment = require("moment");
moment.locale('fr');

exports.run = async (client, message, args, getPlayer, getUser) => {
    if (!client.config.owners.includes(message.author.id)) return message.react("❌");

    client.channels.cache.get("714076184262082580").send(`:red_circle: **[SYSTEM RESTART] Log du ${moment().format('DD/M/YYYY | HH:mm:ss')}\n> Redémarrage lancé par ${message.author.tag}.**`)
    await client.user.setActivity(`processing reboot...`, { type: "WATCHING" });
    message.channel.send("⚙️ Redémarrage en cours...").then(() => {
        process.exit();
    })
};

exports.help = {
    name: "reboot",
    description_fr: "Redémarre le bot",
    description_en: "Restart the bot",
    category: "Staff",
    aliases: ["reb", "_"]
};
