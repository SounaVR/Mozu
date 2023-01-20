const Discord = require("discord.js");
const fs = require("fs");
const strength = require("../playerstats/strength.json");
const config = require("../config.json");
const questL = require("../questhandler/questcompleted.json");
const fishL = require("../playerstats/fishing.json");
const fishInv = require("../playerinventory/fish.json");
const users = require("../users.json");

module.exports.run = async (bot, message, args) => {

  const mFish = bot.emojis.find(emoji => emoji.name === "RPGfish_mediocre");
  const cFish = bot.emojis.find(emoji => emoji.name === "RPGfish_commun");
  const rFish = bot.emojis.find(emoji => emoji.name === "RPGfish_rare");
  const eFish = bot.emojis.find(emoji => emoji.name === "RPGfish_epique");
  const lFish = bot.emojis.find(emoji => emoji.name === "RPGfish_legendaire");
  const rien = bot.emojis.find(emoji => emoji.name === "RPGfish_algues");

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

  if(!fishL[message.author.id]){
  fishL[message.author.id] = {
    level: 1,
    xp: 0
    };
  }
  if (!fishInv[message.author.id]) {
      fishInv[message.author.id] = {
      mFish: 0,
      cFish: 0,
      rFish: 0,
      eFish: 0,
      lFish: 0
      };
   }

  let curLevel = fishL[message.author.id].level;
  let curxp = fishL[message.author.id].xp;
  let xpgained = Math.floor(Math.random() * 10) + 10;
  let fishgained = Math.floor(Math.random() * 3);
  let nxtLvl = fishL[message.author.id].level * 300 * (curLevel * 0.75);

  if(fishgained === 0){
    let failembed = new Discord.RichEmbed()
    .setTitle("Pêche")
    .setColor("#E6E6FA")
    .setDescription(`Pas de chance, vous récupérez des algues ${rien}`);
    return message.channel.send(failembed);
  }

  fs.writeFile("./playerinventory/fish.json", JSON.stringify(fishInv),  (err) => {
    if (err) console.log(err)
  });

  fishL[message.author.id].xp = curxp + xpgained;
  fs.writeFile("./playerstats/fishing.json", JSON.stringify(fishL),  (err) => {
  if (err) console.log(err)
});

  if(fishL[message.author.id].xp >= nxtLvl){

    fishL[message.author.id].level = curLevel + 1;
    fs.writeFile("./playerstats/fishing.json", JSON.stringify(fishL),  (err) => {
      if (err) console.log(err)
    });
    let lvlup = new Discord.RichEmbed()
    .setTitle("Pêche")
    .setColor("#E6E6FA")
    .setDescription(`:up: Vous êtes maintenant niveau ${curLevel + 1} en pêche !`);

    message.channel.send(lvlup)
  }

      let chance = Math.floor(Math.random() * 100);

      if (chance === 20 || chance < 20) {
        let curmFish = fishInv[message.author.id].mFish;

        let fishembed = new Discord.RichEmbed()
        .setTitle("Pêche")
        .setColor("#E6E6FA")
        .setDescription(`Vous récupérez ${fishgained} poisson(s) de qualité médiocre ${mFish}`)
        .addField("Expérience gagnée", `${xpgained} xp.`);
         
        message.channel.send(fishembed);
            
        fishInv[message.author.id].mFish = curmFish + fishgained;
        fs.writeFile("./playerinventory/fish.json", JSON.stringify(fishInv), (err) => {
            if (err) console.log(err)
        });   
      } else if (chance === 40 || chance < 40) {
        let curcFish = fishInv[message.author.id].cFish;

        let fishembed = new Discord.RichEmbed()
        .setTitle("Pêche")
        .setColor("#E6E6FA")
        .setDescription(`Vous récupérez ${fishgained} poisson(s) de qualité commun ${cFish}`)
        .addField("Expérience gagnée", `${xpgained} xp.`);
         
        message.channel.send(fishembed);
            
        fishInv[message.author.id].cFish = curcFish + fishgained;
        fs.writeFile("./playerinventory/fish.json", JSON.stringify(fishInv), (err) => {
            if (err) console.log(err)
        });
      } else if (chance === 60 || chance < 60) {
        let currFish = fishInv[message.author.id].rFish;

        let fishembed = new Discord.RichEmbed()
        .setTitle("Pêche")
        .setColor("#E6E6FA")
        .setDescription(`Vous récupérez ${fishgained} poisson(s) de qualité rare ${rFish}`)
        .addField("Expérience gagnée", `${xpgained} xp.`);
         
        message.channel.send(fishembed);
            
        fishInv[message.author.id].rFish = currFish + fishgained;
        fs.writeFile("./playerinventory/fish.json", JSON.stringify(fishInv), (err) => {
            if (err) console.log(err)
        });
      } else if (chance === 80 || chance < 80) {
        let cureFish = fishInv[message.author.id].eFish;

        let fishembed = new Discord.RichEmbed()
        .setTitle("Pêche")
        .setColor("#E6E6FA")
        .setDescription(`Vous récupérez ${fishgained} poisson(s) de qualité épique ${eFish}`)
        .addField("Expérience gagnée", `${xpgained} xp.`);
         
        message.channel.send(fishembed);
            
        fishInv[message.author.id].eFish = cureFish + fishgained;
        fs.writeFile("./playerinventory/fish.json", JSON.stringify(fishInv), (err) => {
            if (err) console.log(err)
        });
      } else if (chance === 100 || chance < 100) {
        let curlFish = fishInv[message.author.id].lFish;

        let fishembed = new Discord.RichEmbed()
        .setTitle("Pêche")
        .setColor("#E6E6FA")
        .setDescription(`Vous récupérez ${fishgained} poisson(s) de qualité légendaire ${lFish}`)
        .addField("Expérience gagnée", `${xpgained} xp.`);
         
        message.channel.send(fishembed);
            
        fishInv[message.author.id].lFish = curlFish + fishgained;
        fs.writeFile("./playerinventory/fish.json", JSON.stringify(fishInv), (err) => {
            if (err) console.log(err)
        });
      } else if (chance === 0) {
        let failembed = new Discord.RichEmbed()
        .setTitle("Pêche")
        .setColor("#E6E6FA")
        .setDescription(`Pas de chance, vous récupérez des algues ${rien}`);
        return message.channel.send(failembed);

      fs.writeFile("./playerstats/fishing.json", JSON.stringify(fishL), (err) => {
        if (err) console.log(err)
      });
    }
  }
}

module.exports.help = {
  name: "fish",
    aliases: []
}
