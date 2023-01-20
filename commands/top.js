const Discord = require("discord.js");
const mongoose = require("mongoose");
const config = require("../config.json");
// mongoose.connect(`mongodb+srv://Souna:${process.env.DBPASS}@clusterreally-n8szj.mongodb.net/coins?retryWrites=true&w=majority`, {
//   useNewUrlParser: true
// });
const Coins = require("../models/coins.js");
module.exports.run = async (bot, message, args) => {
  
if (message.content === "r!top coins") {
	Coins.find({
		serverID: message.guild.id
	}).sort([
		['coins', 'descending']
	]).exec((err, res) => {
		if (err) console.log(err);

		let embed = new Discord.RichEmbed()
		.setTitle("Top coins")
		.setColor("E6E6FA")
		if (res.length < 10) {
			for(i = 0; i < res.length; i++) {
				let member = message.guild.members.get(res[i].userID) || "User Left"
			if (member === "User Left") {
				embed.addField(`${i + 1}. ${member}`, `**Coins**: ${res[i].coins}`);
			} else {
				embed.addField(`${i + 1}. ${member.user.username}`, `**Coins**: ${res[i].coins}`);
				}
			}
		} else {
			for(i = 0; i < 10; i++) {
				let member = message.guild.members.get(res[i].userID) || "User Left"
			if (member === "User Left") {
				embed.addField(`${i + 1}. ${member}`, `**Coins**: ${res[i].coins}`);
			} else {
				embed.addField(`${i + 1}. ${member.user.username}`, `**Coins**: ${res[i].coins}`);
				}
			}
		}

		message.channel.send(embed);
	})
  }
}

module.exports.help = {
	name: "top",
	aliases: []
}