exports.run = async (client, message, args, getPlayer, getUser) => {
    if (!client.config.owners.includes(message.author.id)) return message.react("❌");
    var con = client.connection

    const someone = message.mentions.members.first();

    if (!someone) {
        return message.reply('please mention an user.');
    }
    con.query(`UPDATE data SET ban = 0 WHERE userid = ${someone.id}`);
    message.channel.send(`${someone} a été débanni !`)
};

exports.help = {
    name: "unban",
    description_fr: "Pour débannir un joueur du bot",
    description_en: "To unban a player from the bot",
    usage_fr: "<joueur>",
    usage_en: "<player>",
    category: "Staff"
};
