const Default = require("../../utils/default.json");

exports.run = async (client, message, args, getPlayer, getUser) => {
    if (message.author.id !== "436310611748454401") return message.channel.send("Commande en maintenance.");
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    //if (!args[0]) return message.channel.send(`${lang.top.correctUsage}`);

    //if (args[0] && ["money", "argent"].includes(args[0].toLowerCase())) {
        const top10query = `SELECT userid, money FROM data ORDER BY cast(money as SIGNED) DESC LIMIT 10`

        const query = querytxt => {
            return new Promise((resolve, reject) => {
            con.query(querytxt, (err, results, fields) => {
                if (err) reject(err);
                resolve([results, fields]);
            });
            });
        };
        const [results, fields] = await query(top10query);

        userids = results.id;

        userids.forEach(element => {
            return console.log('element:', element);
        });

        const map1 = results.map((results, position) => `#${position + 1} **${results.id}** : ${results.money}💰`)

        return message.channel.send("🏆 __**Classement des Pièces de Phénix**__ 🏆\n\n" + map1.join("\n"));
    //}
};

exports.help = {
    name: "top",
    description_fr: "Affiche différents classements",
    description_en: "Displays different rankings",
    usage_fr: "<money>",
    usage_en: "<money>",
    category: "RPG"
};
