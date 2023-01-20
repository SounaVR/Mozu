const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
	message.reply("par ici pour voter : https://discordbots.org/bot/524014915892150291/vote, merci à toi :3");
}

module.exports.help = {
	name: "vote",
    aliases: []
}