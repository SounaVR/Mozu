const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const mineInv = require("../playerinventory/ores.json");
const mineL = require("../playerstats/mining.json");
const outils = require("../playerequipment/outils.json");
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
      const caillou = bot.emojis.find(emoji => emoji.name === "RPGmine_caillou");

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
   if (!outils[message.author.id]) {
    outils[message.author.id] = {
      outils: "mains nues"
    };
   }

    let curxp = mineL[message.author.id].xp;
    let curLevel = mineL[message.author.id].level;
    let curOutils = outils[message.author.id].outils;
    let xpgained = Math.floor(Math.random() * 10) + 10;
    let nxtLvl = mineL[message.author.id].level * 300 * (curLevel * 0.75);

    let curcailloux = mineInv[message.author.id].cailloux;
    let curfer = mineInv[message.author.id].fer;
    //let curargent = mineInv[message.author.id].argent;
    let curor = mineInv[message.author.id].or;
    //let curferN = mineInv[message.author.id].fer_nain;
    //let curargentL = mineInv[message.author.id].argent_lycanthrope;
    //let curorE = mineInv[message.author.id].or_elfe;
    let curmala = mineInv[message.author.id].malachite;
    let curori = mineInv[message.author.id].orichalque;
    let curcobalt = mineInv[message.author.id].cobalt;
    // let cureme = mineInv[message.author.id].emeraude;
    // let cursaph = mineInv[message.author.id].saphir;
    // let currubis = mineInv[message.author.id].rubis;
    // let curdiam = mineInv[message.author.id].diamant;
    // let curjoy = mineInv[message.author.id].joyau_pur;
    // let curebo = mineInv[message.author.id].ebonite;
    // let cureca = mineInv[message.author.id].ecaille_de_dragon_ancien;
    // let curada = mineInv[message.author.id].adamantium;

  //start xp
  mineL[message.author.id].xp = curxp + xpgained;
  fs.writeFile("./playerstats/mining.json", JSON.stringify(mineL), (err) => {
       if (err) console.log(err)
    });
  if (nxtLvl <= mineL[message.author.id].xp) {
       
      mineL[message.author.id].level = curLevel + 1;
       
      let lvlup = new Discord.RichEmbed()
      .setTitle("Minage")
      .setColor("#E6E6FA")
      .setDescription(`:up: Vous êtes maintenant niveau ${curLevel + 1} en minage !`);
       
      message.channel.send(lvlup);

      fs.writeFile("./playerstats/mining.json", JSON.stringify(mineL), (err) => {
      if (err) console.log(err)
   });
  }
  //end xp

  //start mine
    if (curOutils === "mains nues") {
      let drop = Math.ceil(Math.random() * 3);

      mineInv[message.author.id].cailloux = curcailloux + drop;

      fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
            if (err) console.log(err)
        });
        message.channel.send(`Vous récupérez ${drop} ${caillou} à ${curOutils}. Ainsi que ${xpgained} xp.`);
    } else if (curOutils === "pioche en bois") {
        let Cdrop = Math.ceil(Math.random() * 4);
        let Fdrop = Math.ceil(Math.random() * 4);

        mineInv[message.author.id].cailloux =  curcailloux + Cdrop;
        mineInv[message.author.id].fer = curfer + Fdrop;

        fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
            if (err) console.log(err)
        });

        message.channel.send(`Vous récupérez ${Cdrop} ${caillou} et ${Fdrop} ${fer} avec votre ${curOutils}. Ainsi que ${xpgained} xp.`);

       } else if (curOutils === "pioche en fer") {
        let Cdrop = Math.ceil(Math.random() * 5);
        let Fdrop = Math.ceil(Math.random() * 5);
        let Odrop = Math.ceil(Math.random() * 5);

        mineInv[message.author.id].cailloux = curcailloux + Cdrop;
        mineInv[message.author.id].fer = curfer + Fdrop;
        mineInv[message.author.id].or = curor + Odrop;

        fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
            if (err) console.log(err)
        });

        message.channel.send(`Vous récupérez ${Cdrop} ${caillou} ${Fdrop} ${fer} et ${Odrop} ${or} avec votre ${curOutils}. Ainsi que ${xpgained} xp.`);
       } else if (curOutils === "pioche en or") {
        let Cdrop = Math.ceil(Math.random() * 6);
        let Fdrop = Math.ceil(Math.random() * 6);
        let Odrop = Math.ceil(Math.random() * 6);
        let Mdrop = Math.ceil(Math.random() * 6);

        mineInv[message.author.id].cailloux = curcailloux + Cdrop;
        mineInv[message.author.id].fer = curfer + Fdrop;
        mineInv[message.author.id].or = curor + Odrop;
        mineInv[message.author.id].malachite = curmala + Mdrop;
         
        message.channel.send(`Vous récupérez ${Cdrop} ${caillou} ${Fdrop} ${fer} ${Odrop} ${or} et ${Mdrop} ${malachite} avec votre ${curOutils}. Ainsi que ${xpgained} xp.`);
            
        fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
            if (err) console.log(err)
        });   
      } else if (curOutils === "pioche en malachite") {
        let Cdrop = Math.ceil(Math.random() * 7);
        let Fdrop = Math.ceil(Math.random() * 7);
        let Odrop = Math.ceil(Math.random() * 7);
        let Mdrop = Math.ceil(Math.random() * 7);
        let Oridrop = Math.ceil(Math.random() * 7);

        mineInv[message.author.id].cailloux = curcailloux + Cdrop;
        mineInv[message.author.id].fer = curfer + Fdrop;
        mineInv[message.author.id].or = curor + Odrop;
        mineInv[message.author.id].malachite = curmala + Mdrop;
        mineInv[message.author.id].orichalque = curori + Oridrop;
         
        message.channel.send(`Vous récupérez ${Cdrop} ${caillou} ${Fdrop} ${fer} ${Odrop} ${or} ${Mdrop} ${malachite} et ${Oridrop} ${orichalque} avec votre ${curOutils}. Ainsi que ${xpgained} xp.`);    
        
        fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
            if (err) console.log(err)
        });   
      } else if (curOutils === "pioche en orichalque") {
        let Cdrop = Math.ceil(Math.random() * 8);
        let Fdrop = Math.ceil(Math.random() * 8);
        let Odrop = Math.ceil(Math.random() * 8);
        let Mdrop = Math.ceil(Math.random() * 8);
        let Oridrop = Math.ceil(Math.random() * 8);
        let Codrop = Math.ceil(Math.random() * 8);

        mineInv[message.author.id].cailloux = curcailloux + Cdrop;
        mineInv[message.author.id].fer = curfer + Fdrop;
        mineInv[message.author.id].or = curor + Odrop;
        mineInv[message.author.id].malachite = curmala + Mdrop;
        mineInv[message.author.id].orichalque = curori + Oridrop;
        mineInv[message.author.id].cobalt = curcobalt + Codrop;
         
        message.channel.send(`Vous récupérez ${Cdrop} ${caillou} ${Fdrop} ${fer} ${Odrop} ${or} ${Mdrop} ${malachite} ${Oridrop} ${orichalque} et ${Codrop} ${cobalt} avec votre ${curOutils}. Ainsi que ${xpgained} xp.`);
            
        fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
            if (err) console.log(err)
        });   
      } else if (curOutils === "pioche en cobalt") {
        let Cdrop = Math.ceil(Math.random() * 9);
        let Fdrop = Math.ceil(Math.random() * 9);
        let Odrop = Math.ceil(Math.random() * 9);
        let Mdrop = Math.ceil(Math.random() * 9);
        let Oridrop = Math.ceil(Math.random() * 9);
        let Codrop = Math.ceil(Math.random() * 9);

        mineInv[message.author.id].cailloux = curcailloux + Cdrop;
        mineInv[message.author.id].fer = curfer + Fdrop;
        mineInv[message.author.id].or = curor + Odrop;
        mineInv[message.author.id].malachite = curmala + Mdrop;
        mineInv[message.author.id].orichalque = curori + Oridrop;
        mineInv[message.author.id].cobalt = curcobalt + Codrop;

        message.channel.send(`Vous récupérez ${Cdrop} ${caillou} ${Fdrop} ${fer} ${Odrop} ${or} ${Mdrop} ${malachite} ${Oridrop} ${orichalque} et ${Codrop} ${cobalt} avec votre ${curOutils}. Ainsi que ${xpgained} xp.`);
        fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
            if (err) console.log(err)
        });   
      }
    }
};

module.exports.help = {
  name: "mine",
    aliases: []
}