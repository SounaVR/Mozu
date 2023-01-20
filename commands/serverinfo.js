const Discord = require("discord.js");
const config = require("../config.json");
const moment = require("moment");
require('moment/locale/fr.js');
require("moment-duration-format");
moment.locale('fr');
moment().format('D MMM YY');

module.exports.run = async (bot, message, args) => {
    function checkBots(guild) {
    let botCount = 0; // This is value that we will return
    guild.members.forEach(member => { // We are executing this code for every user that is in guild
      if(member.user.bot) botCount++; // If user is a bot, add 1 to botCount value
    });
    return botCount; // Return amount of bots
  }

  function checkMembers(guild) {
    let memberCount = 0;
    guild.members.forEach(member => {
      if(!member.user.bot) memberCount++; // If user isn't bot, add 1 to value. 
    });
    return memberCount;
    }

    const test = moment(message.guild.createdAt).format("dddd Do MMMM YYYY | HH:mm:ss");
        let serverembed = new Discord.RichEmbed()
        .setAuthor(`${message.guild.name}`, message.guild.iconURL)
        .setColor("#E6E6FA")
        .setThumbnail(message.guild.iconURL)
        .addField("Propriétaire du serveur", message.guild.owner, true)
        .addField("ID", message.guild.id, true)
        .addField("Membres", message.guild.memberCount, true)
        .addField("Humains", checkMembers(message.guild), true)
        .addField("Bots", checkBots(message.guild), true)
        .addField("Rôles", message.guild.roles.size, true)
        .addField("Salons", message.guild.channels.size, true)
        .addField("Date de création", test)
        .addField("Région", message.guild.region, true)
        .setFooter(`${bot.user.username}`, bot.user.avatarURL)
        .setTimestamp(message.createdAt);

        return message.channel.send(serverembed);
};

module.exports.help = {
    name: "serverinfo",
    aliases: ['si']
}