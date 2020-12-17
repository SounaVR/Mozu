const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  function getUserFromMention(mention) {
  	if (!mention) return;

  	if (mention.startsWith('<@') && mention.endsWith('>')) {
  		mention = mention.slice(2, -1);

  		if (mention.startsWith('!')) {
  			mention = mention.slice(1);
  		}

  		return client.users.cache.get(mention);
  	}
  }

  let ppEmbed = new Discord.MessageEmbed()
  .setColor(message.member.displayColor)
  if (args[0]) {
  		const user = getUserFromMention(args[0]);
  		if (!user) {
  			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
  		}
      ppEmbed.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      ppEmbed.setDescription("Profile picture of " + `${user}`)
  		return message.channel.send(ppEmbed);
  	}

    ppEmbed.setImage(message.author.displayAvatarURL({ dynamic: true, size : 512 }))
    ppEmbed.setDescription("Your profile picture")
  	return message.channel.send(ppEmbed);
};

module.exports.help = {
  name: "avatar",
  description_fr: "Affiche la photo de profil d'un utilisateur",
  description_en: "Displays a user's profile picture",
  usage_fr: "(@quelqu'un)",
  usage_en: "(@someone)",
  category: "Infos",
  aliases: ["pp"]
};
