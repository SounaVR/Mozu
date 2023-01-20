const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config.json");
const questL = require("../questhandler/questcompleted.json");
const huntL = require("../playerstats/hunting.json");
const meat = require("../playerinventory/meat.json");
const users = require("../users.json");
//const strength = require("../playerstats/strength.json");
//const weapon = require("../playerequipment/weapon.json");

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

  const meatmoji = bot.emojis.find(emoji => emoji.name === "RPGmeat");

  if(!huntL[message.author.id]){
    huntL[message.author.id] = {
      level: 1,
      xp: 0
    };
  }

  if(!meat[message.author.id]){
    meat[message.author.id] = {
      meat: 0
    };
  }
    let curlvl = huntL[message.author.id].level;
    let curxp = huntL[message.author.id].xp;
    let curmeat = meat[message.author.id].meat;
    let chance = Math.ceil(Math.random() * 110);
    let xpgained = Math.floor(Math.random() * 10) + 10;
    let meatgained = Math.floor(Math.random() * 2);
    let nxtLvl = huntL[message.author.id].level * 300 * (curlvl * 0.75);
  
    if(meatgained === 0){
      let failembed = new Discord.RichEmbed()
      .setColor("#E6E6FA")
      .setTitle("Chasse")
      .setDescription("Pas de chance, la bête s'est échappée.");
  
      return message.channel.send(failembed);
    } else if (meatgained !== 0) {
      
    meat[message.author.id].meat = curmeat + meatgained;
        fs.writeFile("./playerinventory/meat.json", JSON.stringify(meat),  (err) => {
          if (err) console.log(err)
        });
      
        huntL[message.author.id].xp = curxp + xpgained;
        fs.writeFile("./playerstats/hunting.json", JSON.stringify(huntL),  (err) => {
        if (err) console.log(err)
      });
      
      if(huntL[message.author.id].xp >= nxtLvl){
      
        huntL[message.author.id].level = curlvl + 1;
        fs.writeFile("./playerstats/hunting.json", JSON.stringify(huntL),  (err) => {
          if (err) console.log(err)
        });
            let lvlup = new Discord.RichEmbed()
            .setTitle("Chasse")
            .setColor("#E6E6FA")
            .setDescription(`:up: Vous êtes maintenant niveau ${curlvl + 1} en chasse !`);
             
            message.channel.send(lvlup);
      
        message.channel.send(lvlup);
        }
    
        let mineembed = new Discord.RichEmbed()
        .setTitle("Chasse")
        .setColor("#E6E6FA")
        .addField("Viande collectée", `Vous avez récupéré ${meatgained} viande(s) ${meatmoji}`)
        .addField("Expérience gagnée", `${xpgained} xp.`);
        
        
        message.channel.send(mineembed);
      }
  }
}

module.exports.help = {
  name: "hunt",
    aliases: []
}
