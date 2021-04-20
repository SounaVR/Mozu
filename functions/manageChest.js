const { nFormatter } = require('../utils/u.js');
const Discord        = require('discord.js'),
    Default          = require('../utils/default.json'),
    Emotes           = require('../utils/emotes.json');

module.exports = function manageChest(client, con, player, message, args, objectName, rarityName, min, max) {
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;

    if (player.items.dungeon_amulet == "0") return message.reply(`${lang.chest.dontHaveAmulet}`);
    if (player.ress[objectName] < args[2]) return message.reply(`${lang.chest.notEnoughChests}`);

    const embed = new Discord.MessageEmbed()
    .setTitle(`${Emotes.chest} ${lang.chest.openingOf} ${args[2]} ${lang.chest.chests} | ${lang.chest.rarity} : ${rarityName}`);

    Danny = {};
    Danny.random = () => min + Math.ceil(Math.random() * (max - min) * args[2]);

    var txt = [],
        txt2 = [],
        sql = [];
    for (const runes in Default.runes.Guerrier) {
        const value = Danny.random(min, max);
        txt.push(`${Emotes.chests.Guerrier[runes]} : ${nFormatter(value)}`);
        sql.push(`${runes} = ${runes} + ${value}`);
    }

    for (const rune in Default.runes.Tools) {
        var value = Danny.random(min, max);
        txt2.push(`${Emotes.chests.Tools[rune]} : ${nFormatter(value)}`);
        sql.push(`${rune} = ${rune} + ${value}`);

        for (const rune2 in Default.runes.Gear.P1) {
            var value = Danny.random(min, max);
            txt2.push(`${Emotes.chests.Gear.P1[rune2]} : ${nFormatter(value)}`);
            sql.push(`${rune2} = ${rune2} + ${value}`);
        }

        for (const rune3 in Default.runes.Gear.P2) {
            var value = Danny.random(min, max);
            txt2.push(`${Emotes.chests.Gear.P2[rune3]} : ${nFormatter(value)}`);
            sql.push(`${rune3} = ${rune3} + ${value}`);
        }
    }

    con.query(`UPDATE ress SET ${sql.join(",")}, ${objectName} = ${player.ress[objectName] - args[2]} WHERE userid = ${userid}`);
    embed.addField(`**Gain**`, `
    ${txt.join("\n")}
    ${txt2.join("\n")}`);

    return message.channel.send(embed);
}