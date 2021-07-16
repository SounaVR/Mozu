const { getPremiumDuration } = require("../../utils/u");
const Discord     = require('discord.js'),
    Emotes        = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer) => {
    const userid = message.author.id;

    const booster = message.guild.members.cache.get(userid);

    const b = getPremiumDuration(booster);
    var text = booster.premiumSinceTimestamp ? `${b.years}y ${b.months}m ${b.days}j ${b.hours}h ${b.minutes}m ${b.seconds}s` : "None"

    const embed = new Discord.MessageEmbed()
    .setTitle("Boost Informations")
    .setColor("#f47fff")
    .setDescription(`Boost depuis : **${text}**`)
    return message.channel.send(embed);
};

exports.help = {
    name: "boost",
    description_fr: "Récupèrez des récompenses en boostant le serveur",
    description_en: "Collect rewards by boosting the server",
    usage_fr: "(claim)",
    usage_en: "(claim)",
    category: "RPG"
};