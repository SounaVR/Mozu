module.exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.");
    const userid = message.author.id;

    if (args[0] && ["en", "EN"].includes(args[0].toLowerCase())) {
        con.query('UPDATE data SET lang = ? WHERE userid = ?', ["en", userid])
        var player = await getPlayer(con, message.author.id);
        const lang = require(`../../utils/text/${player.data.lang}.json`);
        return message.channel.send(lang.confirmLanguage);
    } else if (args[0] && ["fr", "FR", "france", "français"].includes(args[0].toLowerCase())) {
        con.query('UPDATE data SET lang = ? WHERE userid = ?', ["fr", userid])
        var player = await getPlayer(con, message.author.id);
        const lang = require(`../../utils/text/${player.data.lang}.json`);
        return message.channel.send(lang.confirmLanguage);
    } else {
        if (player.data.lang === "fr") return message.channel.send("Langues disponibles : `EN/FR`");
        if (player.data.lang === "en") return message.channel.send("Available languages : `EN/FR`");
    }
// 🇫🇷 🇺🇸
};

module.exports.help = {
    name: "lang",
    description_fr: "Permet le changement de langue",
    description_en: "Allows language change",
    usage_fr: "<EN/FR>",
    usage_en: "<EN/FR>",
    category: "RPG"
};
