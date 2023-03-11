const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { nFormatter } = require('../utils/u.js');
const Emotes = require('../utils/emotes.json');

module.exports = async function manageEnchant(client, con, player, interaction, category, object, objectName) {
    const Enchant = require(`../utils/Items/enchant.json`);
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const react = ['1065891789506093078', '1065891556093067315'];

    if (player.items[object] == "0") return interaction.reply(lang.enchant.levelTooLow);

    const level = Math.floor(player.enchant[objectName])+1;

    const embed = new EmbedBuilder()
    .setColor(interaction.member.displayColor);

    let validButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setEmoji(react[0]).setCustomId('valid');
    let cancelButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji(react[1]).setCustomId('cancel');

    let buttonRow = new ActionRowBuilder()
        .addComponents([validButton, cancelButton]);
    
    //const objectRessource = Enchant[category][object][1];
    const getNeededRessource = (player.enchant[objectName] * player.enchant[objectName] * 5)+1;

    embed.setTitle(`Enchant your item ?`)
    let txt = [];
    let reward = [];

    if (player.ress[`rune_${object}`] < getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(getNeededRessource-player.ress[`rune_${object}`]))})`);
    if (player.ress[`rune_${object}`] >= getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.checked})`);

    if (Enchant[category][object][0].ATK >= 1) reward.push(`${Emotes.ATK} ATK : ${player.data.ATK} => **${player.data.ATK + Enchant[category][object][0].ATK}**`);
    if (Enchant[category][object][0].DEF >= 1) reward.push(`${Emotes.DEF} DEF : ${player.data.DEF} => **${player.data.DEF + Enchant[category][object][0].DEF}**`);
    if (object === "pickaxe") reward.push(`💪 Power : ${player.data.power} => **${player.data.power + Enchant.tools.pickaxe[0].power}**`);

    embed.addFields(
        { name: `**${lang.craft.cost}**`, value: txt.join("\n") },
        { name: "**Reward**", value: `${Emotes.enchant[`rune_${object}`]} ${object} enchant level : ${level - 1} => **${level}**\n${reward.join("\n")}` }
    );

    const msg = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });

    if (player.ress[`rune_${object}`] < getNeededRessource) return;

    const filter = (interact) => interact.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({ ComponentType: ComponentType.Button, filter, time: 30000 });

    collector.on('collect', button => {
        validButton.setDisabled(true);
        cancelButton.setDisabled(true);

        switch (button.customId) {
            case 'valid':
                let need = [];
                let resssql = [];

                if (player.ress[`rune_${object}`] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`rune_${object} = rune_${object} - ${getNeededRessource}`);

                if (need.length >= 1) return interaction.reply(`${lang.enchant.notEnoughRess}`);

                con.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${interaction.user.id}`);
                con.query(`UPDATE data SET ATK = ${player.data.ATK + Number(Enchant[category][object][0].ATK)}, DEF = ${player.data.DEF + Number(Enchant[category][object][0].DEF)} WHERE userid = ${interaction.user.id}`);
                if (object === "pickaxe") con.query(`UPDATE data SET power = ${player.data.power + Number(Enchant.tools.pickaxe[0].power)}`)
                con.query(`UPDATE enchant SET ${objectName} = ${level} WHERE userid = ${interaction.user.id}`);

                interaction.followUp(`${lang.enchant.enchantSuccess.replace("%s", `**${level}**`)}`);
                collector.stop();
                break;
        
            case 'cancel':
                collector.stop();
                interaction.channel.send(`${lang.enchant.canceled}`);
                break;
        }
    });

    collector.on('end', () => {
        msg.edit({ components: [], embeds: [embed] })
    });
}