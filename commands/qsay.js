const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
	if (message.author.id !== '436310611748454401') return;

	let botmessage = args.join(" ");
    message.delete();
    message.channel.send(botmessage);
}

module.exports.help = {
	name: "qsay",
    aliases: []
}