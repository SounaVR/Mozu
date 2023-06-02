const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const Player = require('../Classes/Player');
const dayjs = require('dayjs');

module.exports = async function manageCraft(client, player, interaction, category, objectName, emote, torchAmount) {
    const Craft = require(`../utils/Items/${player.data.lang}.json`);
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const react = ["1065891789506093078", "1065891556093067315"];

    const level = Math.floor(player.items[objectName])+1;
    const levelTitle = Math.floor(player.items[objectName]);
    const torch = objectName ? objectName === "torch" : true;

    const embed = new EmbedBuilder()
    .setColor(interaction.member.displayColor);

    let validButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setEmoji(react[0]).setCustomId("valid");
    let cancelButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji(react[1]).setCustomId("cancel");

    let buttonRow = new ActionRowBuilder()
        .addComponents([validButton, cancelButton]);

    let currentObject = [];
    let currentObjectTitle = [];
    let txt = [];
    let reward = [];
    let sql = [];

    if (torch) {
        currentObject = Craft[category][objectName][0];
        embed.setTitle(`${lang.craft.craft} ${torchAmount} ${currentObject.name} ?`);

        for (const ressource in currentObject.ressource) {
            if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource] * torchAmount) txt.push(`${client.Emotes[ressource]} ${ressource} : ${client.nFormatter(currentObject.ressource[ressource] * torchAmount)} (${client.Emotes.cancel} - Missing ${client.nFormatter(Math.floor((currentObject.ressource[ressource] * torchAmount)-player.ress[ressource.toLowerCase()]))})`);
            if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource] * torchAmount) txt.push(`${client.Emotes[ressource]} ${ressource} : ${client.nFormatter(currentObject.ressource[ressource] * torchAmount)} (${client.Emotes.checked})`);
        }
    } else {
        if (!Craft[category][objectName][level]) return interaction.reply(`${lang.craft.maxLevel}`);

        currentObject = Craft[category][objectName][level];
        currentObjectTitle = Craft[category][objectName][levelTitle];

        if (Craft[category][objectName][level].ATK >= 1) reward.push(`${client.Emotes.ATK} ATK : ${player.data.ATK} => **${player.data.ATK + Number(Craft[category][objectName][level].ATK)}**`);
        if (Craft[category][objectName][level].DEF >= 1) reward.push(`${client.Emotes.DEF} DEF : ${player.data.DEF} => **${player.data.DEF + Number(Craft[category][objectName][level].DEF)}**`);
        if (Craft[category][objectName][level].HP >= 1) reward.push(`♥ HP : ${Player.getMaxHP(player)} => **${Player.getMaxHP(player) + Number(Craft[category][objectName][level].HP)}**`);

        for (const ressource in currentObject.ressource) {
            if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) txt.push(`${client.Emotes[ressource]} ${ressource} : ${client.nFormatter(currentObject.ressource[ressource])} (${client.Emotes.cancel} - Missing ${client.nFormatter(Math.floor(currentObject.ressource[ressource]-player.ress[ressource.toLowerCase()]))})`);
            if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource]) txt.push(`${client.Emotes[ressource]} ${ressource} : ${client.nFormatter(currentObject.ressource[ressource])} (${client.Emotes.checked})`);
        }
    }

    if (!torch) {
        embed.setTitle(`${client.translate(player.data.lang, 'craft.upgrade', currentObjectTitle.name, currentObject.name)}`);
    }

    const maxEnergy = Craft.objects.ring[player.items.ring].energy;
    if (objectName === "pickaxe") reward.push(`💪 Power : ${player.data.power} => **${player.data.power + Number(Craft.tools.pickaxe[level].power)}**`);
    if (objectName === "ring") reward.push(`⚡Energy : ${maxEnergy} => **${currentObject.energy}**\n⏲️ Energy Cooldown : ${dayjs.duration(player.data.energyCooldown).format("s")}s => **${dayjs.duration(currentObject.cooldown).format("s")}s**`);

    embed.addFields({ name: `**${lang.craft.cost}**`, value: txt.join("\n") });

    let rewardLength = reward.join("\n") ? reward.length >= 1 : reward.join("\n");
    if (rewardLength) embed.addFields({ name:`**Reward**`, value: `${emote} ${currentObject.name}\n${reward.join("\n")}` });
    else if (torchAmount) embed.addFields({ name: `**Reward**`, value: `${emote} ${currentObject.name} x${torchAmount}` });
    else embed.addFields({ name: `**Reward**`, value: `${emote} ${currentObject.name}` });

    for (let ressource in currentObject.ressource) {
        let ress = currentObject.ressource[ressource];

        if (player.ress[ressource.toLowerCase()] < ress) {
            validButton.setDisabled(true);
            cancelButton.setDisabled(true);

            return interaction.reply({ embeds: [embed] });
        }
        sql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`);
    }

    const msg = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });
    const collector = msg.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 30000 });

    collector.on('collect', async button => {
        if (button.user.id !== interaction.user.id) return button.reply({ content: lang.notTheAuthorOfTheInteraction, ephemeral: true });

        validButton.setDisabled(true);
        cancelButton.setDisabled(true);

        switch(button.customId) {
            case "valid":
                await client.query(`UPDATE data SET ATK = ${player.data.ATK + Number(currentObject.ATK)}, DEF = ${player.data.DEF + Number(currentObject.DEF)}, power = ${currentObject.power > 0 ? player.data.power + Number(currentObject.power) : player.data.power}, HP = ${currentObject.HP > 0 ? player.data.HP + Number(currentObject.HP) : player.data.HP} WHERE userid = ${interaction.user.id}`);
                await client.query(`UPDATE ress SET ${sql.join(',')} WHERE userid = ${interaction.user.id}`);
                switch (objectName) {
                    case "torch":
                        await client.query(`UPDATE ress SET torch = ${player.ress.torch + Number(torchAmount)} WHERE userid = ${interaction.user.id}`);
                        break;

                    case "ring":
                        await client.query(`UPDATE data SET energyCooldown = ${currentObject.cooldown} WHERE userid = ${interaction.user.id}`);
                        await client.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${interaction.user.id}`);
                        break;

                    default:
                        await client.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${interaction.user.id}`);
                        break;
                }

                if (torch) {
                    collector.stop();
                    return button.reply(`${client.translate(player.data.lang, 'craft.done', `**${currentObject.name} x${torchAmount}**`)}.`)
                } else {
                    collector.stop();
                    return button.reply(`${client.translate(player.data.lang, 'craft.done', `**${currentObject.name}**`)}.`);
                }

            case "cancel":
                collector.stop();
                return button.reply(`${lang.craft.canceled}`);
        }
    });

    collector.on('end', () => {
        msg.edit({ components: [], embeds: [embed] })
    });
}