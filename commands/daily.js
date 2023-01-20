// const db = require("quick.db"),
//       ms = require("parse-ms");

// module.exports.run = async (bot, message, args) => {
//   let cooldown = 8.64e+7,
//       amount = 250;
  
//   let lastDaily = await db.fetch(`lastDaily_${message.author.id}`);
  
//   if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
//     let timeObj = ms(cooldown - (Date.now() -  lastDaily));
    
//     message.channel.send(`Vous avez déjà collecté votre daily, veuillez attendre encore **${timeObj.hours}h ${timeObj.minutes}m** !`);
//   } else {
//     message.channel.send(`${message.author.username}, vous recevez vos ${amount}$ quotidiens !`);
    
//     db.set(`lastDaily_${message.author.id}`, Date.now());
//     db.add(`userBalance_${message.author.id}`, 250);
//   }
// }

module.exports.help = {
  name: "daily",
  aliases: []
}