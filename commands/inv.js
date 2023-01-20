const Discord = require("discord.js");
const fs = require("fs");
const strength = require("../playerstats/strength.json");
const config = require("../config.json");
const questL = require("../questhandler/questcompleted.json");
const fishL = require("../playerstats/fishing.json");
const fishInv = require("../playerinventory/fish.json");
const wcLvl = require("../playerstats/woodcutting.json");
const woodInv = require("../playerinventory/wood.json");
const mineInv = require("../playerinventory/ores.json");
const mineL = require("../playerstats/mining.json");
const meat = require("../playerinventory/meat.json");
const huntL = require("../playerstats/hunting.json");
const outils = require("../playerequipment/outils.json");
const picks = require("../itemdata/picks.json");
const axes = require("../playerequipment/axes.json");
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
  
  const caillou = bot.emojis.find(emoji => emoji.name === "RPGmine_caillou");
  const woodmoji = bot.emojis.find(emoji => emoji.name === "RPGwood");
  const fer = bot.emojis.find(emoji => emoji.name === "RPGmine_fer");
  const argent = bot.emojis.find(emoji => emoji.name === "RPGmine_argent");
  const or = bot.emojis.find(emoji => emoji.name === "RPGmine_or");
  const fer_nain = bot.emojis.find(emoji => emoji.name === "RPGmine_fer_nain");
  const argent_lycanthrope = bot.emojis.find(emoji => emoji.name === "RPGmine_argent_lycanthrope");
  const or_elfe = bot.emojis.find(emoji => emoji.name === "RPGmine_or_elfe");
  const malachite = bot.emojis.find(emoji => emoji.name === "RPGmine_malachite");
  const orichalque = bot.emojis.find(emoji => emoji.name === "RPGmine_orichalque");
  const cobalt = bot.emojis.find(emoji => emoji.name === "RPGmine_cobalt");
  const emeraude = bot.emojis.find(emoji => emoji.name === "RPGmine_emeraude");
  const saphir = bot.emojis.find(emoji => emoji.name === "RPGmine_saphir");
  const rubis = bot.emojis.find(emoji => emoji.name === "RPGmine_rubis");
  const diamant = bot.emojis.find(emoji => emoji.name === "RPGmine_diamant");
  const joyau_pur = bot.emojis.find(emoji => emoji.name === "RPGmine_joyau_pur");
  const ebonite = bot.emojis.find(emoji => emoji.name === "RPGmine_ebonite");
  const ecaille_de_dragon_ancien = bot.emojis.find(emoji => emoji.name === "RPGmine_ecaille_de_dragon_ancien");
  const adamantium = bot.emojis.find(emoji => emoji.name === "RPGmine_adamantium");
  const mFish = bot.emojis.find(emoji => emoji.name === "RPGfish_mediocre");
  const cFish = bot.emojis.find(emoji => emoji.name === "RPGfish_commun");
  const rFish = bot.emojis.find(emoji => emoji.name === "RPGfish_rare");
  const eFish = bot.emojis.find(emoji => emoji.name === "RPGfish_epique");
  const lFish = bot.emojis.find(emoji => emoji.name === "RPGfish_legendaire");
  const meatmoji = bot.emojis.find(emoji => emoji.name === "RPGmeat");

  const kappa = bot.emojis.find(emoji => emoji.name === "kappa");

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

    if (!mineL[message.author.id]) {
      mineL[message.author.id] = {
        level: 1,
          xp: 0
        };
    }
    if (!mineInv[message.author.id]) {
      mineInv[message.author.id] = {
          cailloux: 0,
          fer: 0,
          argent: 0,
          or: 0,
          fer_nain: 0,
          argent_lycanthrope: 0,
          or_elfe: 0,
          malachite: 0,
          orichalque: 0,
          cobalt: 0,
          emeraude: 0,
          saphir: 0,
          rubis: 0,
          diamant: 0,
          joyau_pur: 0,
          ebonite: 0,
          ecaille_de_dragon_ancien: 0,
          adamantium: 0
        };
    }

    if (!fishL[message.author.id]) {
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
  if (!wcLvl[message.author.id]) {
    wcLvl[message.author.id] = {
      level: 1,
      xp: 0
    };
  }
  if (!woodInv[message.author.id]) {
    woodInv[message.author.id] = {
      wood: 0
    };
  }
  if (!outils[message.author.id]) {
    outils[message.author.id] = {
      outils: "mains nues"
    };
  }
  if (!axes[message.author.id]){
    axes[message.author.id] = {
      axes: "mains nues"
    };
  }
    
    let curcailloux = mineInv[message.author.id].cailloux;
    let curmeat = meat[message.author.id].meat;
    let curwood = woodInv[message.author.id].wood;
    let curfer = mineInv[message.author.id].fer;
    //let curargent = mineInv[message.author.id].argent;
    let curor = mineInv[message.author.id].or;
    //let curferN = mineInv[message.author.id].fer_nain;
    //let curargentL = mineInv[message.author.id].argent_lycanthrope;
    //let curorE = mineInv[message.author.id].or_elfe;
    let curmala = mineInv[message.author.id].malachite;
    let curori = mineInv[message.author.id].orichalque;
    let curcobalt = mineInv[message.author.id].cobalt;
    //let cureme = mineInv[message.author.id].emeraude;
    // let cursaph = mineInv[message.author.id].saphir;
    // let currubis = mineInv[message.author.id].rubis;
    // let curdiam = mineInv[message.author.id].diamant;
    // let curjoy = mineInv[message.author.id].joyau_pur;
    // let curebo = mineInv[message.author.id].ebonite;
    // let cureca = mineInv[message.author.id].ecaille_de_dragon_ancien;
    // let curada = mineInv[message.author.id].adamantium;
    let curmF = fishInv[message.author.id].mFish;
    let curcF = fishInv[message.author.id].cFish;
    let currF = fishInv[message.author.id].rFish;
    let cureF = fishInv[message.author.id].eFish;
    let curlF = fishInv[message.author.id].lFish;

    let curPicks = outils[message.author.id].outils;
    let curAxes = axes[message.author.id].axes;

    let curxpH = huntL[message.author.id].xp;
    let curLevelH = huntL[message.author.id].level;
    let curxpC = wcLvl[message.author.id].xp;
    let curLevelC = wcLvl[message.author.id].level;
    let curxpM = mineL[message.author.id].xp;
    let curLevelM = mineL[message.author.id].level;
    let curxpF = fishL[message.author.id].xp;
    let curLevelF = fishL[message.author.id].level;
    let nxtLvlC = wcLvl[message.author.id].level * 300 * (curLevelC * 0.75);
    let nxtLvlM = mineL[message.author.id].level * 300 * (curLevelM * 0.75);
    let nxtLvlF = fishL[message.author.id].level * 300 * (curLevelF * 0.75);
    let nxtLvlH = huntL[message.author.id].level * 300 * (curLevelH * 0.75);
    let differenceC = nxtLvlC - curxpC;
    let differenceM = nxtLvlM - curxpM;
    let differenceF = nxtLvlF - curxpF;
    let differenceH = nxtLvlH - curxpH;

    if (message.author.id !== '436310611748454401') {
    let embed = new Discord.RichEmbed()
    .setColor("#E6E6FA")
    .setTitle(`Inventaire de ${message.author.tag}`)
    .setThumbnail(message.author.displayAvatarURL)
    .addField(`Pêche : Soon...`, `${curmF} ${mFish} | ${curcF} ${cFish} | ${currF} ${rFish} | ${cureF} ${eFish} | ${curlF} ${lFish}`)
    .addField(`Minage : ${curPicks}`, `${curcailloux} ${caillou} | ${curfer} ${fer} | ${curor} ${or} | ${curmala} ${malachite} | ${curori} ${orichalque} | ${curcobalt} ${cobalt}`)
    .addField(`Bûcheronnage : ${curAxes}`, `${curwood} ${woodmoji}`)
    .addField(`Chasse : Soon...`, `${curmeat} ${meatmoji}`)
    .addField("Niveaux", `**Pêche** : niveau **${curLevelF}** | XP restants : **${differenceF}**.\n**Minage** : niveau **${curLevelM}** | XP restants : **${differenceM}**.\n**Bûcheronnage** : niveau **${curLevelC}** | XP restants : **${differenceC}**.\n**Chasse** : niveau **${curLevelH}** | XP restants : **${differenceH}**.`)
    .setFooter("Si besoin : r!help pour les commandes.");

    message.channel.send(embed);
    } else {
        let embed = new Discord.RichEmbed()
        .setColor("#E6E6FA")
        .setTitle(`Inventaire de ${message.author.tag}`)
        .setThumbnail(message.author.displayAvatarURL)
        .addField(`Pêche : Probablement à mains nues`, `∞ ${mFish} | ∞ ${cFish} | ∞ ${rFish} | ∞ ${eFish} | ∞ ${lFish}`)
        .addField(`Minage : ${curPicks}`, `∞ ${caillou} | ∞ ${fer} | ∞ ${or} | ∞ ${malachite} | ∞ ${orichalque} | ∞ ${cobalt}`)
        .addField(`Bûcheronnage : ${curAxes}`, `∞ ${woodmoji}`)
        .addField(`Chasse : Probablement toujours à mains nues ${kappa}`, `∞ ${meatmoji}`)
        .addField("Niveaux", `**Pêche** : niveau **${curLevelF}** | XP restants : **${differenceF}**.\n**Minage** : niveau **${curLevelM}** | XP restants : **${differenceM}**.\n**Bûcheronnage** : niveau **${curLevelC}** | XP restants : **${differenceC}**.\n**Chasse** : niveau **${curLevelH}** | XP restants : **${differenceH}**.`)
        .setFooter("Si besoin : r!help pour les commandes.");

    message.channel.send(embed);
    }
  }
}

module.exports.help = {
  name: "inv",
    aliases: []
}
