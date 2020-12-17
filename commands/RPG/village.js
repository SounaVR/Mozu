const Discord = require('discord.js');
const Default = require('../../utils/default.json');

module.exports.run = async (client, message, args, getPlayer) => {
  var databaselogs = client.channels.cache.find(channel => channel.id === "714080913583243275");

  var con = client.connection
  var player = await getPlayer(con, message.author.id);
  const uname = message.author.tag;
  const userid = message.author.id;

    if (!player) {
    con.query(`INSERT INTO data (username, userid, lang, money, LastDaily, daily, LastHR, LastActivity, LastRep, rep, classe, pickaxe, rune_pickaxe, energy, XP, level, dungeon_stone, stone, coal, copper, iron, gold, malachite, sword,
      rune_sword, shield, rune_shield, wand, rune_wand, bow, rune_bow, PV, mana, ATK, DEF, chest_d, chest_c, chest_b, chest_a, chest_s, tete, rune_tete, epaule, rune_epaule, torse, rune_torse, poignets, rune_poignets, mains, rune_mains, taille, rune_taille,
      jambes, rune_jambes, pieds, rune_pieds, ench_pickaxe, ench_sword, ench_shield, ench_wand, ench_bow, ench_tete, ench_epaule, ench_torse, ench_poignets, ench_mains, ench_taille, ench_jambes, ench_pieds) VALUES ('${uname}', '${userid}', '${Default.player.lang}', '${Default.player.money}', '${Default.player.LastDaily}', '0', '${Default.player.hr}', '${Default.player.LastActivity}',
      '${Default.player.LastRep}', '${Default.player.rep}', '${Default.player.classe}', '0', '0', '${Default.player.energy}', '${Default.mine.xp}', '${Default.mine.level}', '0', '${Default.mine.stone}', '${Default.mine.coal}',
      '${Default.mine.copper}', '${Default.mine.iron}', '${Default.mine.gold}', '${Default.mine.malachite}', '${Default.player.sword}', '-1', '${Default.player.shield}', '-1', '${Default.player.wand}', '-1',
      '${Default.player.bow}', '-1', '${Default.player.PV}', '${Default.player.mana}', '${Default.player.ATK}', '${Default.player.DEF}', '0', '0', '0', '0', '0', '${Default.player.tete}', '0', '${Default.player.epaule}', '0', '${Default.player.torse}',
      '0', '${Default.player.poignets}', '0', '${Default.player.mains}', '0', '${Default.player.taille}', '0', '${Default.player.jambes}', '0', '${Default.player.pieds}', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
      )`, async function(err) {
        if (err) throw err;
        databaselogs.send(`🟢 Données de \`data\` insérées pour **${message.author.id}** aka **${message.author.tag}**.`);
        const waiting = await message.channel.send("🇺🇸 Before playing, you need to choose your language (which can be changed with the `m!lang` command)\n🇫🇷 Avant de commencer, vous devez choisir votre langue (elle pourra être changée avec la commande `m!lang`)").then(a => {
          a.react('🇺🇸');
          a.react('🇫🇷');

          const filter = (reaction, user) => {
            return ['🇺🇸', '🇫🇷'].includes(reaction.emoji.name) && user.id === message.author.id;
          };

          a.awaitReactions(filter, { max: 1 })
          .then(collected => {
            const LangFR = require('../../utils/text/fr.json');
            const LangEN = require('../../utils/text/en.json')
            const reaction = collected.first();
            var classe;

            if (reaction.emoji.name === '🇺🇸') {
              con.query(`UPDATE data SET lang = "en" WHERE userid = ${userid}`)
              classe = LangEN.bvn;
            } else if (reaction.emoji.name === '🇫🇷') {
              con.query(`UPDATE data SET lang = "fr" WHERE userid = ${userid}`)
              classe = LangFR.bvn + ` **${message.author.username}** !\n` + LangFR.bvn2;
            }
            a.reactions.removeAll();
            a.edit(classe).then(e => {
              e.react('⚔️');
              e.react('☄️');
              e.react('🏹');

            const filter = (reaction, user) => {
              return ['⚔️', '☄️', '🏹'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            e.awaitReactions(filter, { max: 1 })
            .then(async collected => {
              var player = await getPlayer(con, message.author.id);
              const lang = require(`../../utils/text/${player.data.lang}.json`);
              const reaction = collected.first();

               if (reaction.emoji.name === '⚔️') {
                 e.edit(`${lang.war}`);
                 con.query(`UPDATE data SET classe = "Guerrier", sword = 0, rune_sword = 0, shield = 0, rune_shield = 0 WHERE userid = ${userid}`)
               } else if (reaction.emoji.name === '☄️') {
                 e.edit(`${lang.mage}`);
                  con.query(`UPDATE data SET classe = "Mage", wand = 0, rune_wand = 0 WHERE userid = ${userid}`)
               } else if (reaction.emoji.name === '🏹') {
                  e.edit(`${lang.hunt}`);
                  con.query(`UPDATE data SET classe = "Chasseur", bow = 0, rune_bow = 0 WHERE userid = ${userid}`)
                }
                a.reactions.removeAll();
              }) // end collected
            }) // end choose class
          }) // end collected
        });
      }); //end query data
    } else {
      message.channel.send("Vous êtes déjà enregistré.");
  }
};

module.exports.help = {
  name: "village",
  description_fr: "Affiche votre village",
  description_en: "Display your village",
  category: "RPG",
  aliases: ["vi"]
};
