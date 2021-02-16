const { checkDays } = require('../../utils/u.js');
const Discord = require("discord.js"),
moment  = require("moment");

exports.run = async (client, message, args, getPlayer, getUser) => {
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
    .addField("Total | Humans and Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} and ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
    .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
    .addField("Channels", `${message.guild.channels.cache.size} channels`, true)
    .addField("Roles", `${message.guild.roles.cache.size} roles`, true)
    .addField("Boosts", `Level ${message.guild.premiumTier} | ${message.guild.premiumSubscriptionCount} boosts`, true)
    .addField("Created at", `${moment.utc(message.channel.guild.createdAt).format('DD/MM/YYYY')}\n(${checkDays(message.channel.guild.createdAt)})`, true)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`${client.user.username}`, client.user.avatarURL())
    .setTimestamp()
  message.channel.send({ embed });
};

exports.help = {
  name: "serverinfo",
  description_fr: "Affiche les informations du serveur",
  description_en: "Displays server information",
  category: "Infos",
  aliases: ["si"]
};
