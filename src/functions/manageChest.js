const { EmbedBuilder } = require('discord.js');

module.exports = function manageChest(client, con, player, interaction, number, objectName, rarityName, min, max) {
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const userid = interaction.user.id;

    if (player.items.dungeon_amulet == "0") return interaction.reply(`${lang.chest.dontHaveAmulet}`);
    if (player.ress[objectName] < number) return interaction.reply(`${lang.chest.notEnoughChests}`);

    const embed = new EmbedBuilder()
    .setTitle(`${client.Emotes.chest} ${client.translate(player.data.lang, "chest.openingOf", number, rarityName)}`);

    Danny = {};
    Danny.random = () => min + Math.ceil(Math.random() * (max - min) * number);
   
    var txt = [],
        txt2 = [],
        sql = [];
    for (const runes in client.Default.runes.Weapons) {
        const value = Danny.random(min, max);
        txt.push(`${client.Emotes.chests.Weapons[runes]} ${runes} : ${client.nFormatter(value)}`);
        sql.push(`${runes} = ${runes} + ${value}`);
    }

    for (const rune in client.Default.runes.Tools) {
        var value = Danny.random(min, max);
        txt2.push(`${client.Emotes.chests.Tools[rune]} ${rune} : ${client.nFormatter(value)}`);
        sql.push(`${rune} = ${rune} + ${value}`);

        for (const rune2 in client.Default.runes.Gear.P1) {
            var value = Danny.random(min, max);
            txt2.push(`${client.Emotes.chests.Gear.P1[rune2]} ${rune2} : ${client.nFormatter(value)}`);
            sql.push(`${rune2} = ${rune2} + ${value}`);
        }

        for (const rune3 in client.Default.runes.Gear.P2) {
            var value = Danny.random(min, max);
            txt2.push(`${client.Emotes.chests.Gear.P2[rune3]} ${rune3} : ${client.nFormatter(value)}`);
            sql.push(`${rune3} = ${rune3} + ${value}`);
        }
    }
    con.query(`UPDATE ress SET ${sql.join(",")}, ${objectName} = ${player.ress[objectName] - number} WHERE userid = ${userid}`);
    embed.addFields({ name: `**Gain**`, value: `${txt.join("\n")}\n${txt2.join("\n")}` });

    return interaction.reply({ embeds: [embed] });
}