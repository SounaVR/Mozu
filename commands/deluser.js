const Discord = require("discord.js");
const config = require("../config.json");
const mongoose = require("mongoose");
// mongoose.connect(`mongodb+srv://Souna:${config.DBPASS}@clusterreally-n8szj.mongodb.net/coins?retryWrites=true&w=majority`, {
// 	useNewUrlParser: true
// });
const Coins = require("../models/coins.js")
module.exports.run = async (bot, message, args) => {
	await message.delete();
	if (message.author.id !== "436310611748454401") return;
	let member = message.mentions.members.first();
	if (!member) return message.reply("oof");

	Coins.findOneAndDelete({
		userID: member.id,
		serverID: message.guild.id
	}, (err, res) => {
		if (err) console.log(err)
		console.log("User with ID " + member.id + " has been deleted from the coin database.");
	})
}

module.exports.help = {
	name: "deluser",
	aliases: []
}