const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config.json");
const questL = require("../questhandler/questcompleted.json");
const wcLvl = require("../playerstats/woodcutting.json");
const woodInv = require("../playerinventory/wood.json");
const users = require("../users.json");
const axes = require("../playerequipment/axes.json");

module.exports.run = async (bot, message, args) => {

  const woodmoji = bot.emojis.find(emoji => emoji.name === "RPGwood");
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

  if(!wcLvl[message.author.id]){
    wcLvl[message.author.id] = {
      level: 1,
      xp: 0
    };
  }

  if(!woodInv[message.author.id]){
    woodInv[message.author.id] = {
      wood: 0
    };
  }
  if(!axes[message.author.id]){
    axes[message.author.id] = {
      axes: "mains nues"
    };
  }
    
    fs.writeFile("./playerequipment/axes.json", JSON.stringify(axes), (err) => {
      if (err) console.log(err)
    });

  let curlvl = wcLvl[message.author.id].level;
  let curxp = wcLvl[message.author.id].xp;
  let curwood = woodInv[message.author.id].wood;
  let chance = Math.ceil(Math.random() * 100);
  let woodgained = Math.floor(Math.random() * 3);
  let xpgained = Math.floor(Math.random() * 10) + 10;
  let nxtLvl = wcLvl[message.author.id].level * 300 * (curlvl * 0.75);
  let curAxes = axes[message.author.id].axes;
    
    wcLvl[message.author.id].xp = curxp + xpgained;
  
    fs.writeFile("./playerstats/woodcutting.json", JSON.stringify(wcLvl),  (err) => {
    if (err) console.log(err)
  });

  if(wcLvl[message.author.id].xp >= nxtLvl){
  
    wcLvl[message.author.id].level = curlvl + 1;
    fs.writeFile("./playerstats/woodcutting.json", JSON.stringify(wcLvl),  (err) => {
      if (err) console.log(err)
    });
    let lvlup = new Discord.RichEmbed()
    .setTitle("Bûcheronnage")
    .setColor("#E6E6FA")
    .setDescription(`:up: Vous êtes maintenant niveau ${curlvl + 1} en coupage d'arbre !`);
  
    message.channel.send(lvlup)
    }
    
  if(curAxes === "mains nues"){
    let drop = Math.ceil(Math.random() * 3);
    
    woodInv[message.author.id].wood = curwood + drop;
    
    fs.writeFile("./playerinventory/wood.json", JSON.stringify(woodInv),  (err) => {
      if (err) console.log(err)
    });
    message.channel.send(`Vous récupérez ${drop} ${woodmoji} à ${curAxes}. Ainsi que ${xpgained} xp.`);
  }}
}

module.exports.help = {
  name: "chop",
    aliases: []
}
