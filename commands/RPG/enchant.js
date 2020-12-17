const Discord = require('discord.js');
const Default = require('../../utils/default.json');

module.exports.run = async (client, message, args, getPlayer) => {
    if (message.author.id !== "436310611748454401") return message.channel.send("⚙️ - Commande en écriture.");
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;
};

module.exports.help = {
  name: "enchant",
  description_fr: "Pour enchanter votre équipement",
  description_en: "To enchant your equipment",
  category: "RPG",
  aliases: ["ench", "en", "enchantement"]
};