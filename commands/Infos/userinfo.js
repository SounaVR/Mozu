const { checkDays } = require('../../utils/u.js');
const Discord       = require('discord.js'),
moment        = require('moment');

exports.run = async (client, message, args, getPlayer, getUser) => {
  const user = message.mentions.users.first() || message.author;
  const member = message.mentions.members.first() || message.member;
  
  if (user) {
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
      .setColor(message.member.displayColor)
      .setThumbnail(user.displayAvatarURL())
      .addField('Created On', `${moment.utc(user.createdAt).format("DD/MM/YYYY")} (${checkDays(user.createdAt)})`, true)
      .addField('Joined On', `${moment.utc(user.joinedAt).format("DD/MM/YYYY")}`, true)
      .addField("Nickname", `${member.nickname !== null ? `${member.nickname}` : 'None'}`)
    message.channel.send(embed);
    }
}
// Help Object
exports.help = {
  name: "userinfo",
  description_fr: "Affiche des informations sur l'utilisateur",
  description_en: "Displays user information",
  usage_fr: "(@quelqu'un)",
  usage_en: "(@someone)",
  category: "Infos",
  aliases: ["ui"]
};
