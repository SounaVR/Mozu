/**
 * @author ReallySouna
 * @file botinfo.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {

const Discord = require("discord.js");
const moment = require("moment");
require('moment/locale/fr.js');
require("moment-duration-format");
moment.locale('fr');
moment().format('D MMM YY');

  const duration = moment.duration(bot.uptime).format(" D [days], HH [hrs], m [mins], s [secs]");
  const test = moment(bot.user.createdAt).format("dddd Do MMMM YYYY | HH:mm:ss");
    let bicon = bot.user.avatarURL();
    let botembed = new Discord.MessageEmbed()
        .setTitle('Bot Informations')
        .setAuthor(`${bot.user.username}`, bicon)
        .setColor(message.member.displayColor)
        .setThumbnail(bicon)
        .addField("Développeur", "ReallySouna#2424", true)
        .addField("Temps allumé", duration, true)
        .addField("Langage", "JavaScript", true)
        .addField("Serveurs", bot.guilds.cache.size, true)
        .addField("Utilisateurs", bot.users.cache.size, true)
        .addField("Mémoire utilisée", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB", true)
        .addField("Mon lien", "[Pour m'inviter cliquez pas](https://cdn.discordapp.com/attachments/657298202688749579/686932751881994266/non.jpg)", true)
        .addField("Date de création", test)
        .setFooter(`${bot.user.username}`, bot.user.avatarURL())
        .setTimestamp()
        message.channel.send(botembed);
};

// Help Object
module.exports.help = {
  name: "botinfo",
  description: "Affiche des informations sur le bot",
  usage: "",
  category: "Infos",
  aliases: ["bi"]
};
