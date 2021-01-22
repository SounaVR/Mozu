const Discord = require('discord.js');
const Default = require('../../utils/default.json');
const Emotes  = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    const databaselogs = client.channels.cache.find(channel => channel.id === "714080913583243275");

    const user = message.mentions.users.first() || message.author;
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    const member = await getUser(con, user.id);
    const userid = message.author.id;

    if (!player) {
    con.query(`INSERT INTO data (
        uuid, username, userid,
        lang, classe, ban, cmd,
        money, energy, LastActivity,
        PV, MANA, ATK, DEF,
        xp, level,
        HR, LastHR, daily, LastDaily, rep, LastRep,
        stone, coal, copper, iron, gold, malachite,
        zone, dungeon_stone,
        chest_d, chest_c, chest_b, chest_a, chest_s,
        pickaxe, rune_pickaxe, ench_pickaxe,
        sword, rune_sword, ench_sword,
        shield, rune_shield, ench_shield,
        wand, rune_wand, ench_wand,
        bow, rune_bow, ench_bow,
        tete, rune_tete, ench_tete,
        epaule, rune_epaule, ench_epaule,
        torse, rune_torse, ench_torse,
        poignets, rune_poignets, ench_poignets,
        mains, rune_mains, ench_mains,
        taille, rune_taille, ench_taille,
        jambes, rune_jambes, ench_jambes,
        pieds, rune_pieds, ench_pieds,
        dungeon_amulet
        ) VALUES (
        '${Default.player.uuid}', '${message.author.tag}', '${message.author.id}',
        '${Default.player.lang}', '${Default.player.classe}', '${Default.player.ban}', '${Default.player.cmd}',
        '${Default.player.money}', '${Default.player.energy}', '${Default.player.LastActivity}',
        '${Default.player.PV}', '${Default.player.MANA}', '${Default.player.ATK}', '${Default.player.DEF}',
        '${Default.player.xp}', '${Default.player.level}',
        '${Default.player.HR}', '${Default.player.LastHR}', '${Default.player.daily}', '${Default.player.LastDaily}', '${Default.player.rep}', '${Default.player.LastRep}',
        '${Default.mine.stone}', '${Default.mine.coal}', '${Default.mine.copper}', '${Default.mine.iron}', '${Default.mine.gold}', '${Default.mine.malachite}',
        '${Default.player.zone}', '${Default.player.dungeon_stone}',
        '${Default.player.chest_d}', '${Default.player.chest_c}', '${Default.player.chest_b}', '${Default.player.chest_a}', '${Default.player.chest_s}',
        '${Default.player.pickaxe}', '${Default.player.rune_pickaxe}', '${Default.player.ench_pickaxe}',
        '${Default.player.sword}', '${Default.player.rune_sword}', '${Default.player.ench_sword}',
        '${Default.player.shield}', '${Default.player.rune_shield}', '${Default.player.ench_shield}',
        '${Default.player.wand}', '${Default.player.rune_wand}', '${Default.player.ench_wand}',
        '${Default.player.bow}', '${Default.player.rune_bow}', '${Default.player.ench_bow}',
        '${Default.player.tete}', '${Default.player.rune_tete}', '${Default.player.ench_tete}',
        '${Default.player.epaule}', '${Default.player.rune_epaule}', '${Default.player.ench_epaule}',
        '${Default.player.torse}', '${Default.player.rune_torse}', '${Default.player.ench_torse}',
        '${Default.player.poignets}', '${Default.player.rune_poignets}', '${Default.player.ench_poignets}',
        '${Default.player.mains}', '${Default.player.rune_mains}', '${Default.player.ench_mains}',
        '${Default.player.taille}', '${Default.player.rune_taille}', '${Default.player.ench_taille}',
        '${Default.player.jambes}', '${Default.player.rune_jambes}', '${Default.player.ench_jambes}',
        '${Default.player.pieds}', '${Default.player.rune_pieds}', '${Default.player.ench_pieds}',
        '${Default.player.dungeon_amulet}'
        )`, async function(err) {
            if (err) throw err;
            databaselogs.send(`🟢 Données insérées pour **${message.author.id}** aka **${message.author.tag}**.`);
            const waiting = await message.channel.send("🇺🇸 Before playing, you need to choose your language (which can be changed with the `m!lang` command)\n🇫🇷 Avant de commencer, vous devez choisir votre langue (elle pourra être changée avec la commande `m!lang`)").then(async a => {
                await a.react('🇺🇸');
                await a.react('🇫🇷');

                const filter = (reaction, user) => {
                    return ['🇺🇸', '🇫🇷'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                con.query(`SELECT COUNT(*) AS usersCount FROM data`, function (err, rows, fields) {
                    if (err) throw err;

                    con.query(`UPDATE data SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
                });

                a.awaitReactions(filter, { max: 1 })
                .then(collected => {
                    const LangFR = require('../../utils/text/fr.json');
                    const LangEN = require('../../utils/text/en.json')
                    const reaction = collected.first();
                    var classe;

                    if (reaction.emoji.name === '🇺🇸') {
                        con.query(`UPDATE data SET lang = "en" WHERE userid = ${userid}`)
                        classe = LangEN.welcome + ` **${message.author.username}** !\n` + LangEN.welcome2;
                    } else if (reaction.emoji.name === '🇫🇷') {
                        con.query(`UPDATE data SET lang = "fr" WHERE userid = ${userid}`)
                        classe = LangFR.welcome + ` **${message.author.username}** !\n` + LangFR.welcome2;
                    }
                    a.reactions.removeAll();
                    a.edit(classe).then(async e => {
                        await e.react('⚔️');
                        await e.react('☄️');
                        await e.react('🏹');

                        const filter = (reaction, user) => {
                        return ['⚔️', '☄️', '🏹'].includes(reaction.emoji.name) && user.id === message.author.id;
                        };

                        e.awaitReactions(filter, { max: 1 })
                        .then(async collected => {
                            var player = await getPlayer(con, message.author.id);
                            const lang = require(`../../utils/text/${player.data.lang}.json`);
                            const reaction = collected.first();

                            if (reaction.emoji.name === '⚔️') {
                                e.edit(`${lang.warrior}`);
                                con.query(`UPDATE data SET classe = "Guerrier", sword = 0, rune_sword = 0, ench_sword = 0, shield = 0, rune_shield = 0, ench_shield = 0 WHERE userid = ${userid}`)
                            } else if (reaction.emoji.name === '☄️') {
                                e.edit(`${lang.mage}`);
                                con.query(`UPDATE data SET classe = "Mage", wand = 0, rune_wand = 0, ench_wand = 0 WHERE userid = ${userid}`)
                            } else if (reaction.emoji.name === '🏹') {
                                e.edit(`${lang.hunter}`);
                                con.query(`UPDATE data SET classe = "Chasseur", bow = 0, rune_bow = 0, ench_bow = 0 WHERE userid = ${userid}`)
                            }
                            a.reactions.removeAll();
                        }) // end collected
                    }) // end choose class
                }) // end collected
            });
        }); //end query data
    } else {
        if (!member) return message.reply("il est pas inscrit")
        const embed = new Discord.MessageEmbed()
        .setTitle(`${user.tag}`)
        .addField("informations", `
        :notepad_spiral: Titre : null\n${Emotes.trophy}Points de succès : X`, true)
        .addField("Badges (X)", `
        <a:sexxx:800109145889964053>`, true)
        .addField("Other stats", `
        Commandes effectuées : ${member.data.cmd}`, true)
        .addField("Ornement", `
        blabla (et en dessous l'ornement en image)`)
        .setFooter(`#${member.data.uuid}`)

        message.channel.send(embed)
    }
};

exports.help = {
  name: "profile",
  description_fr: "Affiche votre profil",
  description_en: "Display your profile",
  category: "RPG",
  aliases: ["profil"]
};
