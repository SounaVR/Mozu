exports.run = async (client, message, args, getPlayer, getUser) => {
    if (!client.config.owners.includes(message.author.id) || !message.member.hasPermission("ADMINISTRATOR")) return message.react("❌");
    var con = client.connection

    const someone = message.mentions.members.first();
    const log = client.channels.cache.find(channel => channel.id === "833863209228042252");

    if (!someone) {
        return message.reply("please mention an user.");
    }
    if (!client.config.owners.includes(someone.id)) {
        con.query(`UPDATE data SET ban = 1 WHERE userid = ${someone.id}`);
        message.channel.send(`${someone} a été banni !`);
        log.send(`${someone} a été banni !`);
    }
};

exports.help = {
    name: "ban",
    description_fr: "Pour bannir un joueur du bot",
    description_en: "To ban a player from the bot",
    usage_fr: "<joueur>",
    usage_en: "<player>",
    category: "Staff"
};
