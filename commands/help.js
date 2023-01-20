const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {

  // let helpEmbed = new Discord.RichEmbed()
  // .setColor(purple)
  // .setDescription("Prefix: !")
  // .addField("Skill Commands", "fish, chop, mine, hunt")
  // .addField("Currency Commands", "buy, pay, coins, shop")
  // .addField("Equipment Commands", "equipment")
  // .addField("Quest Commands", "quest")
  // .addField("PVP Commands", "fight, strength, wins")
  // .addField("Class Commands", "class");

  // message.channel.send(helpEmbed);
    //message.channel.send('"r!hdm" vous envoie un help bien détaillé de chaque commande.');
    let helpEmbed = new Discord.RichEmbed()
    .setTitle("Aide")
    .setDescription("Commandes du bot !")
    .setColor("#E6E6FA")
    .addField("RPG", "`register`, ~~quest~~, ~~class~~, ~~shop~~, ~~buy~~, ~~sell~~, ~~equipment~~, `fight`, `force`, `rate`, `coins`, `pay`, `fish`, `mine`, `chop`, `hunt`, `inv`")
    .addField("Utility", "`vote`, `invite`, `pp`, `top coins`, `suggest`")
    .addField("Infos", "`botinfo`, `serverinfo`, `help`, `ping`")
    .setFooter(`Help demandé par ${message.author.username}`, message.author.displayAvatarURL);
    
    message.channel.send(helpEmbed);
}

module.exports.help = {
  name: "help",
    aliases: []
}
