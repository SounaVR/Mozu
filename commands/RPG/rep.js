/**
 * @author ReallySouna
 * @file rep.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
  const sqlite = require("sqlite3").verbose();
  const Discord = require("discord.js");
  const ms = require("parse-ms");
  let cooldown = 8.64e+7;

  function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return bot.users.cache.get(mention);
    }
  }
  const user = getUserFromMention(args[0]);

  const Default = require("../../utils/default.json");
  const Text = require("../../utils/text/fr.json");

  let db = new sqlite.Database("./data/db.db", sqlite.OPEN_READWRITE);
  let queryD = 'SELECT * FROM data WHERE userid = ?';
  let userid = message.author.id;

  db.get(queryD, [message.author.id], (err, rowA) => { // Récupérer le compte de l'auteur
    if (err) return catchErr(err, message);
    if (!rowA) return message.channel.send("Vous n'êtes pas inscrit.")

    if (rowA.LastRep && cooldown - (Date.now() - rowA.LastRep) > 0) {
      const timeObj = ms(cooldown - (Date.now() - rowA.LastRep))
      return message.channel.send(`Votre point de réputation n'est pas encore disponible ! Revenez dans ${timeObj.hours}h${timeObj.minutes}m${timeObj.seconds}s pour récompenser une bonne personne !`)
    }
    if (!user) return message.channel.send('Votre point de réputation peut être donné maintenant !')

    if (user.id === userid) return message.reply('vous ne pouvez pas vous donner un point de réputation !')
    if (user.id === bot.user.id) return message.reply('je suis assez connu comme ça, merci.')
    if (user.bot) return message.reply("ce bot n'a pas besoin d'être connu.")

    db.get(queryD, [user.id], (err, rowB) => { // Récupérer le compte du mentionné
      if (err) return catchErr(err, message)
      if (!rowB) return message.channel.send("Il est pas inscrit l'autre là.")

      message.channel.send(`<@${userid}> - Votre point de réputation a été donné avec succès à <@${user.id}>.`)

      db.run('UPDATE data SET LastRep = ? WHERE userid = ?', [Date.now(), userid])
      db.run('UPDATE data SET Rep = ? WHERE userid = ?', [rowB.Rep + 1, user.id])
    })
  })
}

// Help Object
module.exports.help = {
  name: 'rep',
  description: 'Donne un point de réputation à un joueur',
  usage: '<@user>',
  category: 'RPG',
  aliases: ['']
}
