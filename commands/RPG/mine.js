/**
 * @author ReallySouna
 * @file mine.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
    const sqlite = require("sqlite3").verbose();
    const Discord = require("discord.js");
    const Default = require("../../utils/default.json");
    const Text = require("../../utils/text/fr.json")

    const cooldown = 50000
    let userid = message.author.id;
    let uname = message.author.tag;
    let db = new sqlite.Database("./data/db.db", sqlite.OPEN_READWRITE);
    let query = `SELECT * FROM mine WHERE userid = ?`;
    let queryD = 'SELECT * FROM data WHERE userid = ?';

    db.get(query, [userid], (err, row) => {
        if (err) return catchErr(err, message)

        db.get(queryD, [userid], (err, rowD) => {
          if (row === undefined || rowD === undefined) {
              message.channel.send("Vous n'êtes pas enregistré dans la base de données, veuillez faire la commande `r!inventory` pour vous y inscrire.");
              return;
        } else {
          if (rowD.LastActivity === null) {
            db.run('UPDATE data SET LastActivity = ? WHERE userid = ?', [Date.now(), userid])
          } else {
            if ((Date.now() - rowD.LastActivity) - cooldown > 0) {
              const timeObj = Date.now() - rowD.LastActivity
              const gagnees = Math.floor(timeObj / cooldown)

              rowD.Energy = (rowD.Energy || 0) + gagnees
              if (rowD.Energy > 100) rowD.Energy = 100
              db.run('UPDATE data SET Energy = ? WHERE userid = ?', [rowD.Energy, userid])
              db.run('UPDATE data SET LastActivity = ? WHERE userid = ?', [Date.now(), userid])
            }
          }
          const embed = new Discord.MessageEmbed()
          .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
          .setColor(message.member.displayColor)

          let xpgained = Math.floor(Math.random() * 10) + 10;
          let xp = row.XP + xpgained;
          let nxtLvl = Math.round(row.level*150*(row.level*0.25));
          if (nxtLvl <= row.XP) {
              db.run(`UPDATE mine SET level = ? WHERE userid = ?`, [row.level + 1, userid]);
          }
          let difference = Math.abs(nxtLvl - row.XP);
          //mine
          let drop = Math.ceil(Math.random() * 5) + 5;
          let Cdrop = Math.ceil(Math.random() * 4) + 4;
          let Fdrop = Math.ceil(Math.random() * 3) + 3;
          let Odrop = Math.ceil(Math.random() * 2) + 2;
          let Mdrop = Math.ceil(Math.random() * 1);
          //mine [numbers]
          let two = drop * args[0];
          let three = Cdrop * args[0];
          let four = Fdrop * args[0];
          let five = Odrop * args[0];
          let six = Mdrop * args[0];
          //mine all
          let un = drop * rowD.Energy;
          let deux = Cdrop * rowD.Energy;
          let trois = Fdrop * rowD.Energy;
          let quatre = Odrop * rowD.Energy;
          let cinq = Mdrop * rowD.Energy;

          //mine [numbers]
          if (args[0] > 0) {
            if (rowD.Energy < args[0]) {
              return message.channel.send(Text.craft.errorEnergy);
            }
            db.run(`UPDATE data SET Energy = ? WHERE userid = ?`, [rowD.Energy - args[0], userid]);
            if (row.Pioche === Default.pioches.default) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${two}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ? WHERE userid = ?`, [xp, row.cailloux + two, userid]);
            }
            if (row.Pioche === Default.pioches.stone) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${two}\n${Default.emotes.cuivre} Cuivres : ${three}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ? WHERE userid = ?`, [xp, row.cailloux + two, row.cuivre + three, userid]);
            }
            if (row.Pioche === Default.pioches.cuivre) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${two}\n${Default.emotes.cuivre} Cuivre : ${three}\n${Default.emotes.fer} Fer : ${four}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ? WHERE userid = ?`, [xp, row.cailloux + two, row.cuivre + three, row.fer + four, userid]);
            }
            if (row.Pioche === Default.pioches.fer) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${two}\n${Default.emotes.cuivre} Cuivre : ${three}\n${Default.emotes.fer} Fer : ${four}\n${Default.emotes.gold} Or : ${five}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ? WHERE userid = ?`, [xp, row.cailloux + two, row.cuivre + three, row.fer + four, row.gold + five, userid]);
            }
            if (row.Pioche === Default.pioches.or) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${two}\n${Default.emotes.cuivre} Cuivre : ${three}\n${Default.emotes.fer} Fer : ${four}\n${Default.emotes.gold} Or : ${five}\n${Default.emotes.malachite} Malachite : ${six}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, row.cailloux + two, row.cuivre + three, row.fer + four, row.gold + five, row.malachite + six, userid]);
            }
            if (row.Pioche === Default.pioches.malachite) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${two}\n${Default.emotes.cuivre} Cuivre : ${three}\n${Default.emotes.fer} Fer : ${four}\n${Default.emotes.gold} Or : ${five}\n${Default.emotes.malachite} Malachite : ${six + 1}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, row.cailloux + two, row.cuivre + three, row.fer + four, row.gold + five, row.malachite + six, userid]);
            }

            embed.addField(`Informations`, `⚡ Énergie utilisée : ${args[0]}\n⚡ Énergie restante : ${rowD.Energy - args[0]}\n${Default.emotes.idk} Exp gagnée: ${xpgained}`, true);
            embed.addField('Niveau', `**Minage** : niveau **${row.level}** | XP : **${xp}**.`)
            message.channel.send(embed);
            //mine
          } else if (!args[0] || args[0] == 0) {
            if (rowD.Energy < 1) {
              return message.channel.send(Text.craft.errorEnergy);
            }
            db.run(`UPDATE data SET Energy = ? WHERE userid = ?`, [rowD.Energy - 1, userid]);
            if (row.Pioche === Default.pioches.default) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${drop}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ? WHERE userid = ?`, [xp, row.cailloux + drop, userid]);
            }
            if (row.Pioche === Default.pioches.stone) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${drop}\n${Default.emotes.cuivre} Cuivres : ${Cdrop}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ? WHERE userid = ?`, [xp, row.cailloux + drop, row.cuivre + Cdrop, userid]);
            }
            if (row.Pioche === Default.pioches.cuivre) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${drop}\n${Default.emotes.cuivre} Cuivre : ${Cdrop}\n${Default.emotes.fer} Fer : ${Fdrop}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ? WHERE userid = ?`, [xp, row.cailloux + drop, row.cuivre + Cdrop, row.fer + Fdrop, userid]);
            }
            if (row.Pioche === Default.pioches.fer) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${drop}\n${Default.emotes.cuivre} Cuivre : ${Cdrop}\n${Default.emotes.fer} Fer : ${Fdrop}\n${Default.emotes.gold} Or : ${Odrop}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ? WHERE userid = ?`, [xp, row.cailloux + drop, row.cuivre + Cdrop, row.fer + Fdrop, row.gold + Odrop, userid]);
            }
            if (row.Pioche === Default.pioches.or) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${drop}\n${Default.emotes.cuivre} Cuivre : ${Cdrop}\n${Default.emotes.fer} Fer : ${Fdrop}\n${Default.emotes.gold} Or : ${Odrop}\n${Default.emotes.malachite} Malachite : ${Mdrop}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, row.cailloux + drop, row.cuivre + Cdrop, row.fer + Fdrop, row.gold + Odrop, row.malachite + Mdrop, userid]);
            }
            if (row.Pioche === Default.pioches.malachite) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${drop}\n${Default.emotes.cuivre} Cuivre : ${Cdrop}\n${Default.emotes.fer} Fer : ${Fdrop}\n${Default.emotes.gold} Or : ${Odrop}\n${Default.emotes.malachite} Malachite : ${Mdrop + 1}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, row.cailloux + drop, row.cuivre + Cdrop, row.fer + Fdrop, row.gold + Odrop, row.malachite + Mdrop, userid]);
            }

            embed.addField(`Informations`, `⚡ Énergie utilisée : 1\n⚡ Énergie restante : ${rowD.Energy - 1}\n${Default.emotes.idk} Exp gagnée: ${xpgained}`, true)
            embed.addField('Niveau', `**Minage** : niveau **${row.level}** | XP : **${xp}**.`)
            message.channel.send(embed);
            //mine all
          } else if (args[0] === "all") {
            if (rowD.Energy < 1) {
              return message.channel.send(Text.craft.errorEnergy);
            }
            db.run(`UPDATE data SET Energy = ? WHERE userid = ?`, [0, userid]);
            if (row.Pioche === Default.pioches.default) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${un}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ? WHERE userid = ?`, [xp, row.cailloux + un, userid]);
            }
            if (row.Pioche === Default.pioches.stone) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${un}\n${Default.emotes.cuivre} Cuivres : ${deux}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ? WHERE userid = ?`, [xp, row.cailloux + un, row.cuivre + deux, userid]);
            }
            if (row.Pioche === Default.pioches.cuivre) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${un}\n${Default.emotes.cuivre} Cuivre : ${deux}\n${Default.emotes.fer} Fer : ${trois}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ? WHERE userid = ?`, [xp, row.cailloux + un, row.cuivre + deux, row.fer + trois, userid]);
            }
            if (row.Pioche === Default.pioches.fer) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${un}\n${Default.emotes.cuivre} Cuivre : ${deux}\n${Default.emotes.fer} Fer : ${trois}\n${Default.emotes.gold} Or : ${quatre}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ? WHERE userid = ?`, [xp, row.cailloux + un, row.cuivre + deux, row.fer + trois, row.gold + quatre, userid]);
            }
            if (row.Pioche === Default.pioches.or) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${un}\n${Default.emotes.cuivre} Cuivre : ${deux}\n${Default.emotes.fer} Fer : ${trois}\n${Default.emotes.gold} Or : ${quatre}\n${Default.emotes.malachite} Malachite : ${cinq}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, row.cailloux + un, row.cuivre + deux, row.fer + trois, row.gold + quatre, row.malachite + cinq, userid]);
            }
            if (row.Pioche === Default.pioches.malachite) {
              embed.addField(`Ressources minées`, `${Default.emotes.caillou} Cailloux : ${un}\n${Default.emotes.cuivre} Cuivre : ${deux}\n${Default.emotes.fer} Fer : ${trois}\n${Default.emotes.gold} Or : ${quatre}\n${Default.emotes.malachite} Malachite : ${cinq + 1}`);
              db.run(`UPDATE mine SET XP = ?, cailloux = ?, cuivre = ?, fer = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, row.cailloux + un, row.cuivre + deux, row.fer + trois, row.gold + quatre, row.malachite + cinq, userid]);
            }

            embed.addField(`Informations`, `⚡ Énergie utilisée : ${rowD.Energy}\n⚡ Énergie restante : 0\n${Default.emotes.idk} Exp gagnée: ${xpgained}`, true);
            embed.addField('Niveau', `**Minage** : niveau **${row.level}** | XP : **${xp}**.`)
            message.channel.send(embed);
          }
        }
    });
})
};

// Help Object
module.exports.help = {
    name: "mine",
    description: "Pour miner des ressources",
    usage: "(énergie) ou (all)",
    category: "RPG",
    aliases: ["m"]
};
