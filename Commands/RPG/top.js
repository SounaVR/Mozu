const Default = require("../../utils/default.json");

exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

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
    const map1 = results.map((results, position) => `#${position + 1} **${results.username}** : ${results.money}💰`);

    return message.channel.send("🏆 __**Classement de la moula**__ 🏆\n\n" + map1.join("\n").replace("#1", "🥇").replace("#2", "🥈").replace("#3", "🥉"));

};

exports.help = {
    name: "top",
    description_fr: "Affiche différents classements",
    description_en: "Displays different rankings",
    usage_fr: "<money>",
    usage_en: "<money>",
    category: "RPG"
};
