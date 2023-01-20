/**
 * @author ReallySouna
 * @file inventory.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
  const sqlite = require('sqlite3').verbose()
  const Discord = require('discord.js')
  const Default = require('../../utils/default.json')
  const fr = require('../../utils/items/fr.json')

  const cooldown = 50000
  const userid = message.author.id
  const uname = message.author.tag
  const db = new sqlite.Database('./data/db.db', sqlite.OPEN_READWRITE)
  const query = 'SELECT * FROM mine WHERE userid = ?'
  const queryD = 'SELECT * FROM data WHERE userid = ?'

  db.get(query, [userid], (err, row) => {
    if (err) return catchErr(err, message)

    db.get(queryD, [userid], (err, rowD) => {
      if (err) return catchErr(err, message)

      if (row === undefined || rowD === undefined) {
        const insertdata = db.prepare('INSERT INTO mine VALUES(?,?,?,?,?,?,?,?,?,?)');/*,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');*/
        insertdata.run(userid, uname, Default.mine.xp, Default.mine.level, Default.pioches.default, Default.mine.cailloux, Default.mine.cuivre, Default.mine.fer, Default.mine.gold, Default.mine.malachite);/*, Default.mine.orichalque, Default.mine.cobalt, Default.mine.argent, Default.mine.fer_nain, Default.mine.argent_lycanthrope, Default.mine.or_elfe, Default.mine.emeraude, Default.mine.saphir, Default.mine.rubis, Default.mine.diamant, Default.mine.joyau_pur, Default.mine.ebonite, Default.mine.ecaille_de_dragon_ancien, Default.mine.adamantium);*/
        insertdata.finalize()
        db.run(`UPDATE mine SET Pioche = ? WHERE userid = ?`, [Default.pioches.default, userid]);

        const insertdataD = db.prepare('INSERT INTO data VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        insertdataD.run(userid, uname, Default.player.money, Default.player.LastDaily, Default.player.hr, Default.player.classe, fr.weapon.default, fr.shield.default, fr.stick.default, fr.bow.default, Default.player.PV, Default.player.MANA, Default.player.ATK, Default.player.DEF, Default.player.LastActivity, Default.player.Energy, Default.player.Rep, Default.player.LastRep)
        insertdataD.finalize()
        //db.close()
        message.channel.send(`test`).then(e => {
           e.react('⚔️');
           e.react('☄️');
           e.react('🏹');

           const filter = (reaction, user) => {
           	return ['⚔️', '☄️', '🏹'].includes(reaction.emoji.name) && user.id === message.author.id;
           };

           e.awaitReactions(filter, { max: 1 })
           	.then(collected => {
           		const reaction = collected.first();

           		if (reaction.emoji.name === '⚔️') {
           			message.reply('vous êtes maintenant un guerrier.');
                 db.run('UPDATE data SET Classe = ? WHERE userid = ?', ["Guerrier", userid])
                 db.run('UPDATE data SET weapon = ? WHERE userid = ?', [fr.weapon.un, userid])
                 db.run('UPDATE data SET shield = ? WHERE userid = ?', [fr.shield.un, userid])
           		} else if (reaction.emoji.name === '☄️') {
           			message.reply('vous êtes maintenant un mage.');
                 db.run('UPDATE data SET Classe = ? WHERE userid = ?', ["Mage", userid])
                 db.run('UPDATE data SET stick = ? WHERE userid = ?', [fr.stick.un, userid])
           		} else if (reaction.emoji.name === '🏹') {
                 message.reply('vous êtes maintenant un chasseur.');
                 db.run('UPDATE data SET Classe = ? WHERE userid = ?', ["Chasseur", userid])
                 db.run('UPDATE data SET bow = ? WHERE userid = ?', [fr.bow.un, userid])
               }
           	})
         })

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

        const IEmbed = new Discord.MessageEmbed()
          .setAuthor(`Inventaire de ${message.author.tag}`, message.author.displayAvatarURL)
          .setColor(message.member.displayColor)
          .setThumbnail(message.author.displayAvatarURL())
          .addField('Pêche : ?', `? ${Default.emotes.cFish} | ? ${Default.emotes.rFish}`, true)/* | ? ${Default.emotes.eFish} | ? ${Default.emotes.idk}*/
          .addField('⚡ Énergie [+1/50s]', `${rowD.Energy || 0}/100`, true)
          .addField(`Minage : ${row.Pioche}`, `${row.cailloux} ${Default.emotes.caillou} | ${row.cuivre} ${Default.emotes.cuivre} | ${row.fer} ${Default.emotes.fer} | ${row.gold} ${Default.emotes.gold} | ${row.malachite} ${Default.emotes.malachite}`)/*\n${row.orichalque} ${Default.emotes.orichalque} | ${row.cobalt} ${Default.emotes.cobalt} | ${row.argent} ${Default.emotes.argent} | ${row.fer_nain} ${Default.emotes.fer_nain} | ${row.argent_lycanthrope} ${Default.emotes.argent_lycanthrope}\n${row.or_elfe} ${Default.emotes.or_elfe} | ${row.emeraude} ${Default.emotes.emeraude} | ${row.saphir} ${Default.emotes.saphir} | ${row.rubis} ${Default.emotes.rubis} | ${row.diamant} ${Default.emotes.diamant}\n${row.joyau_pur} ${Default.emotes.joyau_pur} | ${row.ebonite} ${ebonite} | ${row.ecaille_de_dragon_ancien} ${Default.emotes.ecaille_de_dragon_ancien} | ${row.adamantium} ${Default.emotes.adamantium}`)*/
          .addField('Chasse : ?', `? ${Default.emotes.meat}`)
          //.addField('Niveaux', `**Pêche** : niveau **${null}** | XP restants : **${null}**.\n**Minage** : niveau **${row.level}** | XP restants : **${row.XP}**.\n**Chasse** : niveau **${null}** | XP restants : **${null}**.`)
          .setFooter('Si besoin : r!help pour la liste des commandes.')

        message.channel.send(IEmbed)
      }
    })
  })
}

// Help Object
module.exports.help = {
  name: 'inventory',
  description: 'Affiche votre inventaire',
  usage: '',
  category: 'RPG',
  aliases: ['inv']
}
