const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const Canvas = require("canvas");

module.exports.run = async (bot, message, args) => {

	//if (message.author.id !== '436310611748454401') return message.reply("tu me sembles bien curieux :eyes:");

// bot.on('message', async message => {
// 	if (message.content === 'r!test') {
// 		bot.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
// 	}
// });

// bot.on("guildMemberAdd", async member => {
	
// 		const chan = member.guild.channels.find(channel => channel.id === "601232939128324098");
// 		if (!chan) return console.log("y'a pas ton channel de marde xd");

// 		const canvas = Canvas.createCanvas(700, 250);
// 		const ctx = canvas.getContext("2d");

// 		const background = await Canvas.loadImage("./wallpaper.jpg");

// 		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

// 		const attachment = new Discord.Attachment(canvas.toBuffer(), "welcome-image.png");

// 		chan.send(`Welcome to the server, ${member} !`, attachment);
// 	});

}

module.exports.help = {
    name: "test",
    aliases: []
}