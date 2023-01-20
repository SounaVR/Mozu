const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {

	const m = await message.channel.send("Ping?");
    	m.edit(`T'as cru(e) que j'allais dire pong là ? M D R !!! Sinon j'ai ${Math.round(bot.ping)} ms c:`);
}

module.exports.help = {
	name: "ping",
    aliases: []
}