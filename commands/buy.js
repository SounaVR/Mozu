const Discord = require("discord.js");
const prices = require("../storedata/prices.json");
const names = require("../storedata/names.json");
const fs = require("fs");
const coins = require("../playerequipment/coins.json");
const questL = require("../questhandler/questcompleted.json");
const config = require("../config.json");
const users = require("../users.json");

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
//     let price = prices[args[0]];
//     let item = names[args[0]];
//     if (!item) return message.reply('usage: r!buy [item] [prix]. "r!shop" pour afficher l\'ensemble des objets et les prix.');
//     if (!price) return message.reply('pour connaître les prix faites "r!shop".');
  
//     if(!coins[message.author.id]){
//       coins[message.author.id] = {
//         coins: 0
//       }
//     }
  
//     if(!questL[message.author.id]){
//       questL[message.author.id] = {
//         quest: "1"
//       }
//     }
  
//     if(questL[message.author.id].quest === "5" || args.includes("fer")){
//       questL[message.author.id] = {
//         quest: "6"
//       };
//       fs.writeFile("./questhandler/questcompleted.json", JSON.stringify(questL), (err) => {
//         if (err) console.log(err)
//       });
//     }
  
//     if(coins[message.author.id].coins < price) return message.reply("désolé, vous ne pouvez pas vous le permettre.");
//     let uCoins = coins[message.author.id].coins;
//     coins[message.author.id] = {
//     coins: uCoins - price
//     };
  
//     fs.writeFile("./playerequipment/coins.json", JSON.stringify(coins), (err) => {
//       if (err) console.log(err)
//     });
  
//     message.reply(`vous avez acheter ${item} pour ${price} coins.`);
//     if(questL[message.author.id].quest === "3"){
//       questL[message.author.id] = {
//         quest: "4"
//       };
//       fs.writeFile("./questhandler/questcompleted.json", JSON.stringify(questL), (err) => {
//         if (err) console.log(err)
//       });
//     }
//     if(message.content.includes("epee") || message.content.includes("arc")){
//       const weapon = require("../playerequipment/weapon.json");
//       if(!weapon[message.author.id]) weapon[message.author.id] = {
//         weapon: item
//       };
//       weapon[message.author.id] = {
//         weapon: item
//       };
//       fs.writeFile("./playerequipment/weapon.json", JSON.stringify(weapon), (err) => {
//         if (err) console.log(err)
//       });
//       message.reply(`${item} a été ajouté à votre inventaire !`)
//     }
  
//     //helm equipment
//     if(message.content.includes("tete")){
//       const helmet = require("../playerequipment/helm.json");
//       if(!helmet[message.author.id]) helmet[message.author.id] = {
//         helmet: item
//       };
//       helmet[message.author.id] = {
//         helmet: item
//       };
//       fs.writeFile("./playerequipment/helm.json", JSON.stringify(helmet), (err) => {
//         if (err) console.log(err)
//       });
//       message.reply(`${item} équipé !`)
//     }
  
//     //chest
//     if(message.content.includes("torse")){
//       const chest = require("../playerequipment/chest.json");
//       if(!chest[message.author.id]) chest[message.author.id] = {
//         chest: item
//       };
//       chest[message.author.id] = {
//         chest: item
//       };
//       fs.writeFile("./playerequipment/chest.json", JSON.stringify(chest), (err) => {
//         if (err) console.log(err)
//       });
//       message.reply(`${item} équipé !`)
//     }
  
//     //Legs
//     if(message.content.includes("pantalon")){
//       const legs = require("../playerequipment/legs.json");
//       if(!legs[message.author.id]) legs[message.author.id] = {
//         legs: item
//       };
//       legs[message.author.id] = {
//         legs: item
//       };
//       fs.writeFile("./playerequipment/legs.json", JSON.stringify(legs), (err) => {
//         if (err) console.log(err)
//       });
//       message.reply(`${item} équipé !`)
//     }}

}

module.exports.help = {
  name: "buy",
    aliases: []
}
