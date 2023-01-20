const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
	const text = args.join(" ");
	message.delete();
	let chann = bot.channels.find(channel => channel.id === "603977184691879946");

	let sicon = message.author.displayAvatarURL;
	let embed = new Discord.RichEmbed()
	.setAuthor(`${message.author.username}`, sicon)
	.setColor("#E6E6FA")
	.addField("Suggestion", text)
	.setFooter(`ID : ${message.author.id}`)
	.setTimestamp(message.createdAt);
	chann.send(embed);
	message.reply("\n:warning: :flag_fr: Tout abus sera sévèrement puni !\n:warning: :flag_gb: Any abuse will be severely punished !")
  .then(msg => {
    msg.delete(30000)
    })
}

exports.conf = {
  aliases: []
};

module.exports.help = {
	name: "suggest",
	aliases: []
}