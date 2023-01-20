const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
// 	let member = message.author.id;
// 	bot.channels.get('535017933680803850').createInvite({
//         thing: true,
//         maxUses: 1,
//         maxAge: 86400
//     }).then(invite =>
//     message.author.send(invite.url)
// ); 
//     message.delete();
//     message.reply("check mp.");
message.channel.send("https://discord.gg/7pHJXWk");
}

module.exports.help = {
	name: "invite",
    aliases: []
}