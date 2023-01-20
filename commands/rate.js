const Discord = require("discord.js");
const fs = require("fs");
const coins = require("../playerequipment/coins.json");
const playerclasses = require("../classhandler/playerclasses.json");
const wins = require("../fightlog/wins.json");
const loses = require("../fightlog/loses.json");
const config = require("../config.json");
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

  if(!wins[message.author.id]){
    wins[message.author.id] = {
      wins: 0
    };
  }

  if(!loses[message.author.id]){
    loses[message.author.id] = {
      loses: 0
    };
  }
  let winloss = new Discord.RichEmbed()
  .setColor("#E6E6FA")
  .addField("Victoires", wins[message.author.id].wins)
  .addField("Défaites", loses[message.author.id].loses);

  message.channel.send(winloss)
}
}

module.exports.help = {
  name: "rate",
    aliases: []
}
