exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!profile` command to remedy this.")
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    if (!args[0]) return message.channel.send(`${lang.top.correctUsage}`);

    if (args[0] && ["money", "pp", "argent"].includes(args[0].toLowerCase())) {
    const top10query = `SELECT username, money FROM data ORDER BY cast(money as SIGNED) DESC LIMIT 10`

    const query = querytxt => {
        return new Promise((resolve, reject) => {
        con.query(querytxt, (err, results, fields) => {
            if (err) reject(err);
            resolve([results, fields]);
        });
        });
    };
    const [results, fields] = await query(top10query);

    const map1 = results.map((results, position) => `#${position + 1} **${results.username}** : ${results.money}💰`)

    return message.channel.send("🏆 __**Classement des Pièces de Phénix**__ 🏆\n\n" + map1.join("\n"));
    } else if (args[0] && ["xp"].includes(args[0].toLowerCase())) {
    const top10query = `SELECT username, XP FROM data ORDER BY cast(XP as SIGNED) DESC LIMIT 10`

    const query = querytxt => {
        return new Promise((resolve, reject) => {
        con.query(querytxt, (err, results, fields) => {
            if (err) reject(err);
            resolve([results, fields]);
        });
        });
    };
    const [results, fields] = await query(top10query);

    const map1 = results.map((results, position) => `#${position + 1} **${results.username}** : ${results.XP} points`)

    return message.channel.send("🏆 __**Classement des Points d'Expérience**__ 🏆\n\n" + map1.join("\n"));
    }
};

exports.help = {
    name: "top",
    description_fr: "Affiche différents classements",
    description_en: "Displays different rankings",
    usage_fr: "<XP/money>",
    usage_en: "<XP/money>",
    category: "RPG"
};
