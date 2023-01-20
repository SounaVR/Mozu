/**
 * @author ReallySouna
 * @file profile.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
  const sqlite = require("sqlite3").verbose();
  const Discord = require("discord.js");

  const Default = require("../../utils/default.json");
  const Text = require("../../utils/text/fr.json");

  let db = new sqlite.Database("./data/db.db", sqlite.OPEN_READWRITE);
  let query = `SELECT * FROM mine WHERE userid = ?`;
  let queryD = 'SELECT * FROM data WHERE userid = ?';
  let userid = message.author.id;

  db.get(query, [userid], (err, row) => {
      if (err) return catchErr(err, message)

      db.get(queryD, [userid], (err, rowD) => {
        if (row === undefined || rowD === undefined) {
            message.channel.send("Vous n'êtes pas enregistré dans la base de données, veuillez faire la commande `r!inventory` pour vous y inscrire.");
            return;
      } else {
        const embed = new Discord.MessageEmbed()
          .setAuthor(`Profil de ${message.author.username}`, message.author.displayAvatarURL())
          .setColor(message.member.displayColor)
          .setThumbnail(message.author.displayAvatarURL())
          .addField(`🆙 Level: ${row.level}`, `${Default.emotes.idk} Exp totale: ${row.XP}`, true)
          .addField(`❤️ PV:`, `${rowD.PV}/50`, true)
          .addField(`⭐ Mana:`, `${rowD.Mana}/50`, true)
          .addField(`⚔️ ATK:`, `${rowD.ATK}`, true)
          .addField(`🛡️ DEF:`, `${rowD.DEF}`, true)
          .addField(`💰 Balance: ${rowD.Money}`, `${Default.emotes.idk} Reputations : ${rowD.Rep}`, true)
          .setFooter('Si besoin : r!help pour la liste des commandes.')
        if (rowD.Classe === "Guerrier") {
          embed.addField(`⚔️ Épée:`, rowD.weapon, true)
          embed.addField(`🛡️ Bouclier:`, rowD.shield, true)
        message.channel.send(embed);
        } else if (rowD.Classe === "Mage") {
          embed.addField(`☄️ Bâton:`, rowD.stick)
        message.channel.send(embed);
        } else if (rowD.Classe === "Chasseur") {
          embed.addField(`🏹 Arc:`, rowD.bow)
        message.channel.send(embed);
        }
      }
    })
  })
};

// Help Object
module.exports.help = {
  name: "profile",
  description: "Affiche votre profil",
  usage: "",
  category: "RPG",
  aliases: ["p"]
};
