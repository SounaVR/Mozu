const Discord = require("discord.js");
const questL = require("../questhandler/questcompleted.json");
const questN = require("../questhandler/questlist.json");
const config = require("../config.json");
const users = require("../users.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {

//   let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

//   if (!users[message.author.id]) {
//     users[message.author.id] = {
//       valid: 0
//     };
//   }

//   let curvalid = users[message.author.id].valid;

//   if (curvalid === 0) {
//     return message.reply("désolé, tu ne sembles pas être enregistré, pour ci-faire, vous devez faire la commande `r!register`.");
//   } else if (curvalid === 1) {

//   if(!questL[message.author.id]) questL[message.author.id] = {
//     quest: "1"
//   };
//   let questlvl = questL[message.author.id].quest;

//   let quest = questN[questlvl];
  
//   let questEmbed = new Discord.RichEmbed()
//   .setColor("#E6E6FA")
//   .addField(`Quête: ${questlvl}`, `Nom de la quête: ${quest}`);

//   message.channel.send(questEmbed);
// }
}

module.exports.help = {
  name: "quest",
    aliases: []
}
