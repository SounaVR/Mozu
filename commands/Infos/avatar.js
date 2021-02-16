const Discord = require("discord.js");

exports.run = async (client, message, args, getPlayer, getUser) => {
	const user = getUserFromMention(client, args[0]) || message.author;
	const ppEmbed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor)
		.setImage(user.avatarURL({ dynamic: true, size: 512 }))
		.setDescription("Profile picture of " + `${user}`);
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
