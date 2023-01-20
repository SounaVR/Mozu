const Discord = require("discord.js");
const config = require("../config.json");
const classe = require("../classhandler/playerclasses.json");
const quests = require("../questhandler/questcompleted.json");
const fs = require("fs");
const users = require("../users.json");

module.exports.run = async (bot, message, args) => {
  // if (message.author.id !== '436310611748454401') return message.reply("désolé... Je ne réagis pas aux membres.");

  // let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

  // if (!users[message.author.id]) {
  //   users[message.author.id] = {
  //     valid: 0
  //   };
  // }

  // let curvalid = users[message.author.id].valid;

  // if (curvalid === 0) {
  //   return message.reply("désolé, tu ne sembles pas être enregistré, pour ci-faire, vous devez faire la commande `r!register`.");
  // } else if (curvalid === 1) {

  // if(classe[message.author.id]){
  //   return message.reply(`vous avez déjà choisi la classe: ${classe[message.author.id].classe} !`)
  // }

  // if(!args[0]) return message.channel.send("usage: r!classe ");
  // if(args[0] == "guerrier"){
  //   if(classe[message.author.id]) return message.reply(`vous êtes déjà ${classe[message.author.id].classe} !`);
  //   if(!classe[message.author.id]) classe[message.author.id] = {
  //     classe: "guerrier"
  //   };
  //   // fs.writeFile("./personnages/classes.json", JSON.stringify(classe), (err) => {
  //   //   if (err) console.log(err)
  //   // });
  //   // quests[message.author.id] = {
  //   //   quest: "2"
  //   // };
  //   fs.writeFile("./quests/questcompleted.json", JSON.stringify(quests), (err) => {
  //     if(err) console.log(err)
  //   });
  //   return message.reply(`vous avez choisi la classe **Guerrier** !`);

  // }
  // if(args[0] == "chasseur"){
  //   if(classe[message.author.id]) return message.reply(`vous êtes déjà ${classe[message.author.id].classe} !`);
  //   if(!classe[message.author.id]) classe[message.author.id] = {
  //     classe: "chasseur"
  //   };
  //   fs.writeFile("./classhandler/playerclasses.json", JSON.stringify(classes), (err) => {
  //     if (err) console.log(err)
  //   });
  //   // quests[message.author.id] = {
  //   //   quest: "2"
  //   // };
  //   // fs.writeFile("./quests/questcompleted.json", JSON.stringify(quests), (err) => {
  //   //   if(err) console.log(err)
  //   // });
  //   return message.reply(`vous avez choisi la classe **Chasseur** !`);
  //   }
  // }
}

module.exports.help = {
  name: "classe",
    aliases: []
}
