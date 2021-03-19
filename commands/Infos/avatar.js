const Discord = require("discord.js");

exports.run = async (client, message, args, getPlayer, getUser) => {
	let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
	const ppEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
		.setImage(member.user.avatarURL({ dynamic: true, size: 512 }))
		.setDescription("Profile picture of " + `${member}`);
	message.channel.send(ppEmbed);
};

exports.help = {
  name: "avatar",
  description_fr: "Affiche la photo de profil d'un utilisateur",
  description_en: "Displays a user's profile picture",
  usage_fr: "(@quelqu'un)",
  usage_en: "(@someone)",
  category: "Infos",
  aliases: ["pp"]
};
