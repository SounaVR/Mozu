const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js'),
    Default          = require('../../utils/default.json'),
    Emotes           = require('../../utils/emotes.json');

function manageChest(client, con, player, message, args, objectName, rarityName, min, max) {
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;

    if (player.data.dungeon_amulet == "0") return message.reply(`${lang.chest.dontHaveAmulet}`);
    if (player.data[objectName] < args[2]) return message.reply(`${lang.chest.notEnoughChests}`);

    const embed = new Discord.MessageEmbed()
    .setTitle(`${Emotes.chest} ${lang.chest.openingOf} ${args[2]} ${lang.chest.chests} | ${lang.chest.rarity} : ${rarityName}`);

    Danny = {};
    Danny.random = () => min + Math.ceil(Math.random() * (max - min) * args[2]);

    var txt = [],
        txt2 = [],
        sql = [];
    for (const runes in Default.runes[player.data.classe]) {
        const value = Danny.random(min, max);
        txt.push(`${Emotes.chests[player.data.classe][runes]} : ${nFormatter(value)}`);
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

    con.query(`UPDATE data SET ${sql.join(",")}, ${objectName} = ${player.data[objectName] - args[2]} WHERE userid = ${userid}`);
    embed.addField(`**Gain**`, `
    ${txt.join("\n")}
    ${txt2.join("\n")}`);

    return message.channel.send(embed);
}

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    args[0] = "o" || "open";
    if (!args[0].toLowerCase()) return message.reply(`${lang.chest.correctUsage}`);
    if (!args[2] || args[2] < 1) return message.reply(`${lang.chest.correctUsage}`);
    if (!args[1].toLowerCase()) return message.reply(`${lang.chest.correctUsage}`);

    switch (args[1].toLowerCase()) {
        case "d":
            manageChest(client, con, player, message, args, 'chest_d', `${lang.chest.rarity_d}`, 1, 75);
            break;
        case "c":
            manageChest(client, con, player, message, args, 'chest_c', `${lang.chest.rarity_c}`, 76, 200);
            break;
        case "b":
            manageChest(client, con, player, message, args, 'chest_b', `${lang.chest.rarity_b}`, 201, 600);
            break;
        case "a":
            manageChest(client, con, player, message, args, 'chest_a', `${lang.chest.rarity_a}`, 601, 900);
            break;
        case "s":
            manageChest(client, con, player, message, args, 'chest_s', `${lang.chest.rarity_s}`, 1000, 1500);
            break;

        default:
            message.reply(`${lang.chest.correctUsage}`);
            break;
    }
};

exports.help = {
    name: "chest",
    description_fr: "Ouvrir des coffres pour obtenir des runes d'enchantements.",
    description_en: "Open chests to get enchantment runes.",
    usage_fr: "<open> <d/c/b/a/s> <quantité>",
    usage_en: "<open> <d/c/b/a/s> <quantity>",
    category: "RPG",
    aliases: ["ch"]
};

//75
//76-200
//201-600
//601-900
//1000-1500
