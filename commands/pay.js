const Discord = require("discord.js");
const fs = require("fs");
const coins = require("../playerequipment/coins.json");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {

if(!coins[message.author.id]){
  coins[message.author.id] = {
  coins: 0
  };
}

if(isNaN(args[1])) return message.reply("usage: r!pay [@user] [amount]")
if(coins[message.author.id].coins < args[2]) return message.reply(`désolé, vous avez juste ${coins[message.author.id].coins} coins.`);


let mentUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!mentUser) return message.reply("usage: r!pay [@user] [amount]");
if(message.author.id === mentUser.id) return message.reply("donner de l'argent à soi-même... Alalah, n'importe quoi.");
if(!coins[mentUser.id]){
  coins[mentUser.id] = {
    coins: 0
  }
}
let uCoins = coins[message.author.id].coins;
let mCoins = coins[mentUser.id].coins;
if(uCoins < args[1]) return message.reply("vous n'avez pas assez de coins.");
if(args[1] < 1) return message.reply("usage: r!pay [@user] [amount]");
if(!args[1]) return message.reply("usage: r!pay [@user] [amount]");

coins[message.author.id] = {
coins: uCoins - parseInt(args[1])
};
coins[mentUser.id] = {
coins: mCoins + parseInt(args[1])
};

fs.writeFile("./playerequipment/coins.json", JSON.stringify(coins), (err) => {
  if (err) console.log(err)
});
message.channel.send(`${mentUser} a bien reçu ${args[1]} coins de ${message.author}. Oubliez pas de le remercier.`);

}

module.exports.help = {
  name: "pay",
    aliases: []
}
