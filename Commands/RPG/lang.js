const Default = require("../../utils/default.json");

module.exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);

    if (args[0] && ["en", "EN"].includes(args[0].toLowerCase())) {
        con.query(`UPDATE data SET lang = "en" WHERE userid = ${message.author.id}`)
        var player = await getPlayer(con, message.author.id);
        const lang = require(`../../utils/text/${player.data.lang}.json`);
        return message.channel.send(lang.confirmLanguage.replace("%s", "`EN`"));
    } else if (args[0] && ["fr", "FR", "france", "français"].includes(args[0].toLowerCase())) {
        con.query(`UPDATE data SET lang = "fr" WHERE userid = ${message.author.id}`)
        var player = await getPlayer(con, message.author.id);
        const lang = require(`../../utils/text/${player.data.lang}.json`);
        return message.channel.send(lang.confirmLanguage.replace("%s", "`FR`"));
    } else {
        var player = await getPlayer(con, message.author.id);
        const lang = require(`../../utils/text/${player.data.lang}.json`);
        return message.channel.send(lang.availableLanguages);
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
