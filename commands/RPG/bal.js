const { nFormatter } = require("../../utils/u.js");
const Emotes         = require("../../utils/emotes.json");
const Default        = require("../../utils/default.json");

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    message.channel.send(`💳 ► ${lang.bal.actualBal.replace("%s", `**${nFormatter(player.data.money)}**${Emotes.cash}`)}`);
};

exports.help = {
    name: "bal",
    description_fr: "Affiche votre solde",
    description_en: "Displays your balance",
    category: "RPG",
    aliases: ["balance"]
};
