const Discord = require("discord.js");
const config = require("../config.json");
const a = require("../a.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if (message.author.id !== "436310611748454401") return message.reply("only the owner can use this command.");

	if(!a[message.author.id]){
    a[message.author.id] = {
      a: 0
    };
  }
	message.delete();
	let bUser = bot.users.get(args[0]);
	let curA = a[message.author.id].a;

	let sicon = message.author.displayAvatarURL;
	let embed = new Discord.RichEmbed()
	.setAuthor(`${message.author.username}`, sicon)
	.setColor("#E6E6FA")
	.setTitle("Unban")
	.setDescription("🇫🇷 Vous êtes débanni.\n🇬🇧 You have been unbanned.")
	.addField("⚠", `:flag_fr: Merci de ne pas reproduire d'erreur et de respecter les règles.\n:flag_gb: Please do not repeat the error and follow the rules.`)
	.setTimestamp(message.createdAt);
	bUser.send(embed);

	a[message.author.id].a = curA - 1;
    	fs.writeFile("./a.json", JSON.stringify(a), (err) => {
    		if (err) console.log(err)
    });
}

module.exports.help = {
	name: "daya",
	aliases: []
}