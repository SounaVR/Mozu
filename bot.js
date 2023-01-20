require('dotenv').config();
const config = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");
const a = require("./a.json");
// const mongoose = require("mongoose");
// mongoose.connect(`mongodb+srv://Souna:${process.env.DBPASS}@clusterreally-n8szj.mongodb.net/coins?retryWrites=true&w=majority`, {
//   useNewUrlParser: true
// });;
//let coins = require("./playerequipment/coins.json");
const Coins = require("./models/coins.js")
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

// const http = require("http");
// const express = require("express");
// const app = express();

// app.get("/", (request, response) => {
//   //console.log("Ping received!");
//   response.sendStatus(200);
// });

// // This keeps the bot running 24/7
// app.listen(process.env.PORT);


// var server = http.createServer(app);
// const listener = server.listen(process.env.PORT, function() {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
// setInterval(() => {
//   http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
// }, 280000);

// const DBL = require("dblapi.js");
// const dbl = new DBL(process.env.DBLTOKEN, { webhookServer: listener, webhookAuth: 'password'}, bot);

// dbl.webhook.on('ready', hook => {
//   console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
// });
// dbl.webhook.on('vote', vote => {
//   var logsvote = bot.channels.find(channel => channel.id === "593669237952741386");
//   var tt = bot.users.get(vote.user).tag
//   logsvote.send(`<@${vote.user}>/${tt} a voté, merci à lui ! :3\nVous désirez voter vous aussi ? Voici le lien : https://discordbots.org/bot/524014915892150291/vote :p`);
// });

//let usedCommandRecently = new Set();

//start rainbow

// const size    = config.colors;
// const rainbow = new Array(size);

// for (var i=0; i<size; i++) {
//   var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
//   var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
//   var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

//   rainbow[i] = '#'+ red + green + blue;
// }

// function sin_to_hex(i, phase) {
//   var sin = Math.sin(Math.PI / size * 2 * i + phase);
//   var int = Math.floor(sin * 127) + 128;
//   var hex = int.toString(16);

//   return hex.length === 1 ? '0'+hex : hex;
// }

// let place = 0;
// const servers = config.servers;

// function changeColor() {
//   for (let index = 0; index < servers.length; ++index) {    
//     bot.guilds.get(servers[index]).roles.find(role => role.name === config.roleName).setColor(rainbow[place])
//     .catch(console.error);
    
//     if(config.logging){
//       console.log(`[ColorChanger] Changed color to ${rainbow[place]} in server: ${servers[index]}`);
//     }
//     if(place == (size - 1)){
//       place = 0;
//     }else{
//       place++;
//     }
//   }
// }

//end rainbow

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log(`Je n'ai pas pu trouver "commands".`);
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        });
  });
});

var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth();
curr_month++;
var curr_year = d.getFullYear();

var curr_hour = d.getHours();
var curr_min = d.getMinutes();
var curr_sec = d.getSeconds();

bot.on('ready', async () => {
    console.log(`${bot.user.username} is ready !`);
    console.log(`I have ${bot.guilds.size} server(s).`);
//    var systemlogs = bot.channels.find(channel => channel.id === "593669329850204204");
//    let embed = new Discord.RichEmbed()
//    .setTitle(`[SYSTEM] Log ${curr_date}/${curr_month}/${curr_year} | ${curr_hour}:${curr_min}:${curr_sec}`)
//    .setDescription("ReallyHirina vient de démarrer !")
//    .setColor("#1DCC8F");
//    systemlogs.send(embed);
    //setInterval(changeColor, config.speed);
    //bot.user.setActivity("#TeamReally | r!help", "https://twitch.tv/truexpixels");
    bot.user.setStatus('dnd')
    setInterval(() => {
      //bot.user.setActivity(`${bot.guilds.size} servers & ${bot.users.size} users | r!help`, {type: "WATCHING"});
      bot.user.setActivity("maintenance", {type: "PLAYING"});
    }, 15000);
  

  setInterval(() => {
        dbl.postStats(bot.guilds.size);
    }, 1800000);
});

bot.on('disconnect', () => console.log('I just disconnected, making sure you know, i will reconnect now...'));

bot.on('reconnecting', () => console.log('I am reconnecting now!'));

bot.afk = new Map();
bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = config.prefix;

  //   if (message.content.includes(message.mentions.users.first())) {
  //   let mentioned = bot.afk.get(message.mentions.users.first().id);
  //   if (mentioned) message.channel.send(`**${mentioned.usertag}** est actuellement afk. Raison : ${mentioned.reason}`);
  // }
  // let afkcheck = bot.afk.get(message.author.id);
  // if (afkcheck) return [bot.afk.delete(message.author.id), message.reply(`re ! J'ai bien retiré ton AFK.`)];
  

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

msg = message.content.toLowerCase();

if(!a[message.author.id]){
    a[message.author.id] = {
      a: 0
    };
  }
  
if (a[message.author.id].a === 1) {
    message.delete();
    message.reply('\n:warning: :flag_fr: Vous êtes "banni" pour non-respect des règles, si vous pensez que c\'est une erreur, merci de contacter ReallySouna#2424.\n:warning: :flag_gb: You are "banned" for non-compliance, if you think it\'s a mistake, please contact ReallySouna#2424.')
    .then(msg => {
    msg.delete(30000)
    })
    return;
  } else if (msg.startsWith(config.prefix)) {
//  if (usedCommandRecently.has(message.author.id)) {
//    message.delete();

//    let cdembed = new Discord.RichEmbed()
//    .setAuthor(message.author.username)
//    .setColor("#d30909")
//    .addField("❌ Cooldown", "Merci de patienter 10 secondes avant d'utiliser cette commande.");
//    return message.channel.send(cdembed).then(msg => {msg.delete(6000)});
//  } if (message.author.id !== "436310611748454401") {
//  usedCommandRecently.add(message.author.id);
//  setTimeout(() => {
//    usedCommandRecently.delete(message.author.id);
//  }, 10000);
//}
    //backup : 
    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if (commandFile) commandFile.run(bot, message, args);
  }
    //message.reply("\n:flag_us: I'm in maintenance, try again later :x:\n:flag_fr: Je suis en maintenance, réessayez plus tard.");
    // } else if (!msg.startsWith(config.prefix)) {
    //   let coinstoadd = Math.ceil(Math.random() * 5000);
    //   Coins.findOne({
    //     userID: message.author.id,
    //     serverID: message.guild.id
    //   }, (err, res) => {
    //     if (err) console.log(err);
    //     if (!res) {
    //       const NewDoc = new Coins({
    //         userID: message.author.id,
    //         serverID: message.guild.id,
    //         coins: coinstoadd
    //       });
    //       NewDoc.save().catch(err => console.log(err))
    //     } else {
    //       res.coins = res.coins + coinstoadd;
    //       res.save().catch(err => console.log(err));
    //     }
    //   });
    // }

//     setInterval(function(){
//     var date = new Date();
//     var jour = date.getDay();
//     var heure = date.getHours();
//     var minutes = date.getMinutes();
//     // if(jour === 4) {
//     //     if(heure === 13) {
//     //         if(minutes === 0)
//     //              bot.channels.get("535027267638657024").send({embed: {
//     //          color: 3066993,
//     //          title: 'Example 1',
//     //          description: 'une desc' }});
//     //         if(minutes === 1)
//     //             bot.channels.get("535027267638657024").send({embed: {
//     //          color: 3447003,
//     //          title: 'Example 2',
//     //          description: 'une desc' }});
//     //         if(minutes === 2)
//     //             bot.channels.get("535027267638657024").send({embed: {
//     //          color: 15844367,
//     //          title: 'Example 3',
//     //          description: 'une desc' }});
//     //     }
//             if(minutes === 26) {
//          bot.channels.get("535027267638657024").send("test 26m");
//             if(minutes === 27)
//          bot.channels.get("535027267638657024").send("test 27m");
//             if(minutes === 28)
//          bot.channels.get("535027267638657024").send("test 28m");
//         }
 
//         // if(heure === 18) {
//         //     if(minutes === 0)
//         // bot.channels.get("535027267638657024").send({embed: {
//         //      color: 15158332,
//         //      title: 'Examples',
//         //      description: 'desc' }});
//         // }
//     //}
// }, 1 * 60000);

//   setTimeout(() => {
//     cooldown.delete(message.author.id);
// }, chratis_cooldown_time * 1000);

});

bot.on('guildMemberAdd', member => {
    
//    let serverTag = member.guild.name
//    
//    var embed = new Discord.RichEmbed()
//    .setColor('#00BFFF')
//    .setDescription(`Bienvenue <@${member.user.id}> sur ${serverTag} !`)
//    return member.send({embed})
    var gRole = member.guild.roles.find(role => role.name === "Members");
    if (!gRole) return;
    member.addRole(gRole);
});

bot.on("guildCreate", function (guild) {
  // This event triggers when the bot joins a guild.
  var uOwner = guild.owner;
  var logschannel = bot.channels.find(channel => channel.id === "593669576173289472");
  var sicon = guild.iconURL;
  var embed = new Discord.RichEmbed()
    .setDescription("Nouveau serveur !")
    .setColor("#1DCC8F")
    .setThumbnail(sicon)
    .addField("Serveur", guild.name)
    .addField("Serveur ID", guild.id)
    .addField("Lien d'invitation", "Après l'embed")
    .addField("Owner", guild.owner.user.username)
    .addField("Owner ID", guild.owner.id)
    .addField("Nombre de personnes", guild.members.size)
    .addField("Nombre de channels", guild.channels.size)
    .addField("J'ai maintenant", `${bot.guilds.size} serveurs.`)
    logschannel.send(embed);
    uOwner.send(":flag_fr: Coucou, déjà merci de m'avoir ajouté, c'était pour vous dire que je suis encore en développement et que si tu souhaites suivre le développement ou encore rapporter un bug ou autre voici mon serveur de support : https://discord.gg/7pHJXWk . Au passage tu peux checker mon subordonné et l'ajouter : https://discordbots.org/bot/602157289423765505, tu devrais pas être déçu :wink:\n:flag_us: Hi sorry, the bot is in French only, my developer will do English much later.\n:flag_es: Hola lo siento, el bot está sólo en francés, mi desarrollador hará inglés mucho más tarde.");
    let textChannel = guild.channels
    .filter(function (channel) {return channel.type === 'text'}) //|| channel.type === 'voice'
    .first().createInvite().then(invite => logschannel.send(invite.url))
    // console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    // console.log(`I have ${bot.guilds.size} server(s).`);
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  var logschannel = bot.channels.find(channel => channel.id === "593669576173289472");
  var embed = new Discord.RichEmbed()
  .setDescription("me suis fait viré chef...")
  .setColor("#d109dd")
  .addField("Serveur", guild.name)
  .addField("Serveur ID", guild.id)
  .addField("Owner", guild.owner.user.username)
  .addField("Owner ID", guild.owner.id)
  .addField("J'ai maintenant", `${bot.guilds.size} serveurs.`)
  logschannel.send(embed);
  // console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  // console.log(`I have ${bot.guilds.size} server(s).`);
});

bot.login(process.env.TOKEN);
