const Discord = require("discord.js");
const fs = require("fs");
//const coins = require("../playerequipment/coins.json");
const config = require("../config.json");
const users = require("../users.json");
const Coins = require("../models/coins.js");
const mongoose = require("mongoose");
// mongoose.connect(`mongodb+srv://Souna:${process.env.DBPASS}@clusterreally-n8szj.mongodb.net/coins?retryWrites=true&w=majority`, {
//   useNewUrlParser: true
// });

module.exports.run = async (bot, message, args) => {
  //message.channel.send("commande désactivée temporairement, raison : build database");
  const money = bot.emojis.find(emoji => emoji.name === "RPGmoney");

  Coins.findOne({
    userID: message.author.id,
    serverID: message.guild.id
  }, (err, res) => {
    if (err) console.log(err);

    let embed = new Discord.RichEmbed()
    .setColor("#E6E6FA")
    .addField("Coins", res.coins + `${money}`)
    message.channel.send(embed);
  })

  // let users = JSON.parse(fs.readFileSync("users.json", "utf8"));
  // const money = bot.emojis.find(emoji => emoji.name === "RPGmoney");

  // if (!users[message.author.id]) {
  //   users[message.author.id] = {
  //     valid: 0
  //   };
  // }

  // let curvalid = users[message.author.id].valid;

  // if (curvalid === 0) {
  //   return message.reply("désolé, tu ne sembles pas être enregistré, pour ci-faire, vous devez faire la commande `r!register`.");
  // } else if (curvalid === 1) {

  // if(!coins[message.author.id]) coins[message.author.id] = {
  //   coins: 0
  // };

  // let uCoins = coins[message.author.id].coins;

  // if(!args[1]) {
  //   let coinEmbed = new Discord.RichEmbed()
  //   .setColor("#E6E6FA")
  //   .addField("Coins", `${uCoins} ${money}`);
  //   return message.channel.send(coinEmbed);
  // }

  // // if(args[0] === "giveall"){
  // //   if(!message.member.hasPermission("ADMINISTRATOR")) return;
  // //
  // //   return;
  // // }

  // if (args[0] === "set") {
  //   if (message.author.id !== '436310611748454401') return message.reply("commande réservée au dev.");
  //   let mentUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
  //   if(!mentUser) return message.reply("usage: r!coins set [@user] [amount]");
  //   let coinAmt = parseInt(args[2]);

  //   coins[mentUser.id] = {
  //     coins: coinAmt
  //   };
  //   fs.writeFile("./playerequipment/coins.json", JSON.stringify(coins), (err) => {
  //     if (err) console.log(err)
  //   });
  //   message.reply(`économies de ${mentUser} définies à ${coins[mentUser.id].coins}.`);

  //   return
  //   }

    

    

  // }
}

module.exports.help = {
  name: "coins",
    aliases: []
}