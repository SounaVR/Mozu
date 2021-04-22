const Discord = require('discord.js'),
    Default   = require('../../utils/default.json'),
    Emotes    = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const databaselogs = client.channels.cache.find(channel => channel.id === "827453945131696139");

    const user = message.mentions.users.first() || message.author;
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    const member = await getUser(con, user.id);
    const userid = message.author.id;

    if (!player) {
        await con.query(`INSERT INTO data (
        uuid, username, userid, lang, ban, money, lastActivity,
        PV, MANA, ATK, DEF,
        HR, lastHR, daily, lastDaily, rep, lastRep
        ) VALUES (
        '${Default.player.uuid}', '${message.author.username}#${message.author.discriminator}', '${message.author.id}', '${Default.player.lang}', '${Default.player.ban}',
        '${Default.player.money}', '${Default.player.lastActivity}',
        '${Default.player.PV}', '${Default.player.MANA}', '${Default.player.ATK}', '${Default.player.DEF}',
        '${Default.player.HR}', '${Default.player.lastHR}', '${Default.player.daily}', '${Default.player.lastDaily}', '${Default.player.rep}', '${Default.player.lastRep}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **data** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **data** : **${message.author.id}** aka **${message.author.tag}**.`);
        }); //end query data

        await con.query(`INSERT INTO ress (
        uuid, userid, energy, zone, dungeon_stone, stone, coal, copper, iron, gold, malachite,
        chest_d, chest_c, chest_b, chest_a, chest_s,
        rune_pickaxe, rune_sword, rune_shield, rune_head, rune_shoulders, rune_chest, rune_wrists,
        rune_hands, rune_waist, rune_legs, rune_feet
        ) VALUES (
        '${Default.player.uuid}', '${message.author.id}', '${Default.player.energy}', '${Default.player.zone}', '${Default.player.dungeon_stone}',
        '${Default.mine.stone}', '${Default.mine.coal}', '${Default.mine.copper}', '${Default.mine.iron}', '${Default.mine.gold}', '${Default.mine.malachite}',
        '${Default.player.chest_d}', '${Default.player.chest_c}', '${Default.player.chest_b}', '${Default.player.chest_a}', '${Default.player.chest_s}',
        '${Default.player.rune_pickaxe}', '${Default.player.rune_sword}', '${Default.player.rune_shield}', '${Default.player.rune_head}', '${Default.player.rune_shoulders}', '${Default.player.rune_chest}', '${Default.player.rune_wrists}',
        '${Default.player.rune_hands}', '${Default.player.rune_waist}', '${Default.player.rune_legs}', '${Default.player.rune_feet}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **ress** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **ress** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM ress`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE ress SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
                con.query(`UPDATE data SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query ress

        await con.query(`INSERT INTO items (
        uuid, userid, ring, dungeon_amulet,
        pickaxe, sword, shield,
        head, shoulders, chest, wrists,
        hands, waist, legs, feet
        ) VALUES (
        '${Default.player.uuid}', '${message.author.id}', '${Default.player.ring}','${Default.player.dungeon_amulet}',
        '${Default.player.pickaxe}', '${Default.player.sword}', '${Default.player.shield}',
        '${Default.player.head}', '${Default.player.shoulders}', '${Default.player.chest}', '${Default.player.wrists}',
        '${Default.player.hands}', '${Default.player.waist}', '${Default.player.legs}', '${Default.player.feet}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **items** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **items** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM items`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE items SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query items

        await con.query(`INSERT INTO enchant (
        uuid, userid,
        ench_pickaxe, ench_sword, ench_shield,
        ench_head, ench_shoulders, ench_chest, ench_wrists,
        ench_hands, ench_waist, ench_legs, ench_feet
        ) VALUES (
        '${Default.player.uuid}', '${message.author.id}',
        '${Default.player.ench_pickaxe}', '${Default.player.ench_sword}', '${Default.player.ench_shield}',
        '${Default.player.ench_head}', '${Default.player.ench_shoulders}', '${Default.player.ench_chest}', '${Default.player.ench_wrists}',
        '${Default.player.ench_hands}', '${Default.player.ench_waist}', '${Default.player.ench_legs}', '${Default.player.ench_feet}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **enchant** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **enchant** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM enchant`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE enchant SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query enchant

        await con.query(`INSERT INTO prospect (
        uuid, userid, sapphire, amber,
        citrine, ruby, jade, amethyst
        ) VALUES (
        '${Default.player.uuid}', '${message.author.id}', '${Default.player.sapphire}', '${Default.player.amber}',
        '${Default.player.citrine}', '${Default.player.ruby}', '${Default.player.jade}', '${Default.player.amethyst}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **prospect** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **prospect** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM prospect`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE prospect SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query prospect

        await con.query(`INSERT INTO stats (
        uuid, userid, cmd
        ) VALUES (
        '${Default.player.uuid}', '${message.author.id}', '${Default.player.cmd}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **stats** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **stats** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM stats`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE stats SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query stats
        message.channel.send("You are now registered. Enjoy !\n*Do `m!help` to display the list of commands and you can change your language with `m!lang`*.")
    } else {
        if (!member) return message.reply("il est pas inscrit")
        const embed = new Discord.MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL())
        .addField("informations", `
        :notepad_spiral: Titre : null\n${Emotes.trophy}Points de succès : X`, true)
        .addField("Badges (X)", `
        <a:sexxx:800109145889964053>`, true)
        .addField("Other stats", `
        Commandes effectuées : ${member.stats.cmd}`, true)
        .addField("Ornement", "X")
        // .attachFiles(["./utils/images/ornement.png"])
        // .setImage("attachment://ornement.png")
        .setFooter(`#${member.stats.uuid}`)

        message.channel.send(embed)
    }
};

exports.help = {
    name: "profile",
    description_fr: "Affiche votre profil",
    description_en: "Display your profile",
    category: "RPG",
    aliases: ["profil", "p"]
};
