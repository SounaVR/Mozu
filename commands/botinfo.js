const Discord = require("discord.js");
const config = require("../config.json");
const moment = require("moment");
require('moment/locale/fr.js');
require("moment-duration-format");
// require('moment-range');
// require('moment-timezone');
moment.locale('fr');
moment().format('D MMM YY');

module.exports.run = async (bot, message, args) => {
    // const newYork    = moment.tz("2014-06-01 12:00", "America/New_York");
    // const losAngeles = newYork.clone().tz("America/Los_Angeles");
    // const london     = newYork.clone().tz("Europe/London");
    const duration = moment.duration(bot.uptime).format(" D [days], HH [hrs], m [mins], s [secs]");
    const test = moment(bot.user.createdAt).format("dddd Do MMMM YYYY | HH:mm:ss");
        let bicon = bot.user.avatarURL;
        let botembed = new Discord.RichEmbed()
            .setTitle('Bot Informations')
            .setAuthor(`${bot.user.username}`, bicon)
            .setColor("#E6E6FA")
            .setThumbnail(bicon)
            .addField("Développeur", "ReallySouna#2424", true)
            .addField("Temps allumé", duration, true)
            .addField("Langage", "JavaScript", true)
            .addField("Serveurs", bot.guilds.size.toLocaleString(), true)
            .addField("Utilisateurs", bot.users.size.toLocaleString(), true)
            .addField("Mémoire utilisée", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB", true)
            .addField("Mon lien", "[Pour m'inviter cliquez ici](https://discordapp.com/oauth2/authorize?client_id=524014915892150291&permissions=8&scope=bot)", true)
            .addField("Date de création", test);
            //bot.user.createdAt
            message.channel.send(botembed);
    
//    let sEmbed = new Discord.RichEmbed()
//    .setColor(config.color)
//    .setTitle("= STATISTIQUES =")
//    .addField("Mémoire utilisée", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB")
//    .addField("Temps allumé", duration)
//    .addField("Utilisateurs", bot.users.size.toLocaleString())
//    .addField("Serveurs", bot.guilds.size.toLocaleString())
//    .addField("Channels", bot.channels.size.toLocaleString());
}

module.exports.help = {
    name: 'botinfo',
    aliases: []
}