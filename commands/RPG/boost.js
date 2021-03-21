require("moment-duration-format");
// const { timeFormating } = require('timeformatter');
const Discord     = require('discord.js'),
    Emotes        = require('../../utils/emotes.json'),
    moment        = require("moment");
moment.locale("fr");

exports.run = async (client, message, args, getPlayer) => {
    // var con = client.connection
    // var player = await getPlayer(con, message.author.id);
    // if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
    // const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;

    const booster = message.guild.members.cache.get(userid);
    var isBooster = message.member.premiumSinceTimestamp ? moment(Date.now() - message.member.premiumSinceTimestamp).format("Y[y] M[m] D[j] HH[h] m[m] s[s]") : "None"

    const embed = new Discord.MessageEmbed()
    .setTitle("Boost Informations")
    .setDescription(`Semaines de boost : **X**
        Niveau de boost : **X** ${Emotes.boost1}
        Récompense actuelle : **X**
        Boost depuis : **${isBooster}**`)
    //moment(booster.premiumSinceTimestamp).format("M[m] D[j] HH[h] m[m] s[s]")
    return message.channel.send(embed);
    //.premiumSince
    //.premiumSinceTimestamp
};

exports.help = {
    name: "boost",
    description_fr: "Récupèrez des récompenses en boostant le serveur",
    description_en: "Collect rewards by boosting the server",
    usage_fr: "(claim)",
    usage_en: "(claim)",
    category: "RPG"
};
