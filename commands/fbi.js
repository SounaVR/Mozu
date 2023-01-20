const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
	const padider = bot.emojis.find(emoji => emoji.name === "FBI");
  message.delete();
	message.channel.send(`${padider}`)
}

module.exports.help = {
	name: "fbi",
  aliases: []
}