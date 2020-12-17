const Discord = require("discord.js");
const moment = require('moment');

module.exports.run = async (client, message, args) => {
  function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};
  let user = message.mentions.users.first() || message.author;
  let member = message.mentions.members.first() || message.member;
  if (user) {
    if (!user.roles){
      user.roles = [];
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
      .setColor(message.member.displayColor)
      .setThumbnail(user.displayAvatarURL())
      .addField('Created On', `${moment.utc(user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} (${checkDays(user.createdAt)})`, true)
      .addField('Joined On', `${moment.utc(user.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
      .addField("Nickname", `${member.nickname !== null ? `${member.nickname}` : 'None'}`)
    message.channel.send(embed);
  }
};

// Help Object
module.exports.help = {
  name: "userinfo",
  description_fr: "Affiche des informations sur l'utilisateur",
  description_en: "Displays user information",
  usage_fr: "(@quelqu'un)",
  usage_en: "(@someone)",
  category: "Infos",
  aliases: ["ui"]
};
