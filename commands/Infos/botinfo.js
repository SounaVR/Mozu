const Discord = require("discord.js");
const { version } = require('../../package');

module.exports.run = async (client, message, args) => {
  var con = client.connection;

  const moment = require("moment");
  require('moment/locale/fr.js');
  require("moment-duration-format");
  moment.locale('fr');
  moment().format('D MMM YY');

  con.query(`SELECT COUNT(*) AS usersCount FROM data`, function(err, rows, fields) {
    if (err) throw err;

  const duration = moment.duration(client.uptime).format("D [days], HH [hrs], m [mins], s [secs]");
  const test = moment(client.user.createdAt).format("dddd Do MMMM YYYY | HH:mm:ss");
    let bicon = client.user.avatarURL();
    let botembed = new Discord.MessageEmbed()
        .setTitle('Bot Informations')
        .setAuthor(`${client.user.username}`, bicon)
        .setColor(message.member.displayColor)
        .setThumbnail(bicon)
        .addField("Creator", "ReallySouna#2424", true)
        .addField("Version", `v${version}`, true)
        .addField("Servers", client.guilds.cache.size, true)

        .addField("Users", client.users.cache.size, true)
        .addField("Players", rows[0].usersCount, true)
        .addField("Channels", client.channels.cache.size, true)

        .addField("Uptime", duration, true)
        .addField("Library", "discord.js", true)

        .addField("Memory used", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " Mb", true)
        .addField("My link", "[Don't click](https://cdn.discordapp.com/attachments/706350683766390854/776848631935270922/3237789807_1_3_brmovBmI.jpg)", true)
        .addField("Creation Date", test, true)

        .setTimestamp()
        message.channel.send(botembed);
      })
};

module.exports.help = {
  name: "botinfo",
  description_fr: "Affiche des informations sur le bot",
  description_en: "Displays information about the bot",
  category: "Infos",
  aliases: ["bi"]
};
