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
	let reason = args.slice(1).join(' ');

	let sicon = message.author.displayAvatarURL;
	let embed = new Discord.RichEmbed()
	.setAuthor(`${message.author.username}`, sicon)
	.setColor("#E6E6FA")
	.setTitle("Punished !")
	.setDescription("🇫🇷 Vous avez été sanctionné.\n🇬🇧 You have been sanctioned")
	.addField("Raison/Reason", reason)
	.addField("Pourquoi/Why", `:warning: :flag_fr: Vous êtes "banni" pour non-respect des règles, si vous pensez que c\'est une erreur, merci de contacter ReallySouna#2424 ou [rejoignez le serveur de support](https://discord.gg/7pHJXWk).\n:warning: :flag_gb: You are "banned" for non-compliance, if you think it\'s a mistake, please contact ReallySouna#2424 or [join support server](https://discord.gg/7pHJXWk).`)
	.setTimestamp(message.createdAt);
	bUser.send(embed);

	a[message.author.id] = {
    	a: 1
    };
    	fs.writeFile("./a.json", JSON.stringify(a), (err) => {
    		if (err) console.log(err)
    });
}

module.exports.help = {
	name: "aya",
  aliases: []
}