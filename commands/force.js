const Discord = require("discord.js");
const fs = require("fs");
const strength = require("../playerstats/strength.json");
const config = require("../config.json");
const questL = require("../questhandler/questcompleted.json");
const users = require("../users.json");

module.exports.run = async (bot, message, args) => {

  let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

  if (!users[message.author.id]) {
    users[message.author.id] = {
      valid: 0
    };
  }

  let curvalid = users[message.author.id].valid;

  if (curvalid === 0) {
    return message.reply("désolé, tu ne sembles pas être enregistré, pour ci-faire, vous devez faire la commande `r!register`.");
  } else if (curvalid === 1) {

  if(!strength[message.author.id]){
    strength[message.author.id] = {
      level: 1,
      xp: 0
    };
  }

  let sLvl = strength[message.author.id].level;
  let sxp = strength[message.author.id].xp;

  if(!questL[message.author.id]){
    questL[message.author.id] = {
      quest: "1"
    };
  }

  if(sLvl >= 15 && questL[message.author.id].quest === "7"){
    questL[message.author.id] = {
      quest: "8"
    };

    fs.writeFile("./questhandler/questcompleted.json", JSON.stringify(questL),  (err) => {
      if (err) console.log(err)
    });
  }
  let nxtLvl = sLvl * 300 * (sLvl * 0.75);
  let xpleft = nxtLvl - sxp;
  let sEmbed = new Discord.RichEmbed()
  .setColor("#E6E6FA")
  .setTitle("Niveau et xp")
  .addField("Niveau", sLvl, true)
  .addField("xp", sxp, true)
  .setFooter(`${xpleft} xp restants pour le niveau suivant.`, `${message.author.displayAvatarURL}`);
  message.channel.send(sEmbed);

  }
}

module.exports.help = {
  name: "force",
    aliases: []
}
