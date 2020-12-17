const Discord = require("discord.js");
const moment = require("moment");

module.exports.run = async (client, message, args) => {
  function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};
let verifLevels = {
  "NONE": "None",
  "LOW": "Low",
  "MEDIUM": "Medium",
  "HIGH": "(╯°□°）╯︵  ┻━┻",
  "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
};
let region = {
    "brazil": ":flag_br: Brazil",
    "europe": ":flag_eu: Central Europe",
    "singapore": ":flag_sg: Singapore",
    "us-central": ":flag_us: U.S. Central",
    "sydney": ":flag_au: Sydney",
    "us-east": ":flag_us: U.S. East",
    "us-south": ":flag_us: U.S. South",
    "us-west": ":flag_us: U.S. West",
    "eu-west": ":flag_eu: Western Europe",
    "vip-us-east": ":flag_us: VIP U.S. East",
    "london": ":flag_gb: London",
    "amsterdam": ":flag_nl: Amsterdam",
    "hongkong": ":flag_hk: Hong Kong",
    "russia": ":flag_ru: Russia",
    "southafrica": ":flag_za: South Africa"
};
const embed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setColor(message.member.displayColor)
    .addField("Name", message.guild.name, true)
    .addField("ID", message.guild.id, true)
    .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
    .addField("Region", region[message.guild.region], true)
    .addField("Total | Humans | Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
    .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
    .addField("Channels", message.guild.channels.cache.size, true)
    .addField("Roles", message.guild.roles.cache.size, true)
    .addField("Created at", `${moment.utc(message.channel.guild.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')} (${checkDays(message.channel.guild.createdAt)})`, true)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`${client.user.username}`, client.user.avatarURL())
    .setTimestamp()
message.channel.send({embed});
};

module.exports.help = {
  name: "serverinfo",
  description_fr: "Affiche les informations du serveur",
  description_en: "Displays server information",
  category: "Infos",
  aliases: ["si"]
};
