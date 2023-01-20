/**
 * @author ReallySouna
 * @file avatar.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
  const Discord = require("discord.js");

  function getUserFromMention(mention) {
  	if (!mention) return;

  	if (mention.startsWith('<@') && mention.endsWith('>')) {
  		mention = mention.slice(2, -1);

  		if (mention.startsWith('!')) {
  			mention = mention.slice(1);
  		}

  		return bot.users.cache.get(mention);
  	}
  }

  let ppEmbed = new Discord.MessageEmbed()
  .setColor(message.member.displayColor)
  if (args[0]) {
  		const user = getUserFromMention(args[0]);
  		if (!user) {
  			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
  		}
      ppEmbed.setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      ppEmbed.setDescription("Avatar de " + `${user}`)
  		return message.channel.send(ppEmbed);
  	}

    ppEmbed.setImage(message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    ppEmbed.setDescription("Votre avatar")
  	return message.channel.send(ppEmbed);
};

// Help Object
module.exports.help = {
  name: "avatar",
  description: "Affiche la photo de profil d'un utilisateur",
  usage: "(@user)",
  category: "Infos",
  aliases: ["pp"]
};
