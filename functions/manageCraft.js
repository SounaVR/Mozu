const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { nFormatter } = require('../utils/u.js');
const Emotes         = require('../utils/emotes.json'),
    moment           = require('moment');

module.exports = async function manageCraft(con, player, interaction, category, objectName, emote) {
    const Craft = require(`../utils/Items/${player.data.lang}.json`);
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];

    const level = Math.floor(player.items[objectName])+1;
    const levelTitle = Math.floor(player.items[objectName]);

    const embed = new MessageEmbed()
    .setColor(interaction.member.displayColor);

    let validButton = new MessageButton().setStyle("SUCCESS").setEmoji(react[0]).setCustomId("valid");
    let cancelButton = new MessageButton().setStyle("DANGER").setEmoji(react[1]).setCustomId("cancel");

    let buttonRow = new MessageActionRow()
        .addComponents([validButton, cancelButton]);

    let currentObject = [];
    let currentObjectTitle = [];
    let txt = [];
    let reward = [];
    let sql = [];
    let amount;
    
    // if (objectName === "torch") {
    //     currentObject = Craft[category][objectName][0];
    //     if (!args[1] || args[1] == 1) {
    //         amount = 1;
    //     } else if (args[1] >= 2) {
    //         amount = args[1];
    //    } else {
    //         return interaction.reply(`${lang.craft.invalidNumber}`);
    //     }
    //     embed.setTitle(`${lang.craft.craft} ${amount} "${currentObject.name}" ?`);

    //     for (const ressource in currentObject.ressource) {
    //         if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource] * amount) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * amount)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor((currentObject.ressource[ressource] * amount)-player.ress[ressource.toLowerCase()]))})`);
    //         if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource] * amount) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * amount)} (${Emotes.checked})`);
    //     }
    // } else {
        if (!Craft[category][objectName][level]) return interaction.reply(`${lang.craft.maxLevel}`);

        currentObject = Craft[category][objectName][level];
        currentObjectTitle = Craft[category][objectName][levelTitle];

        if (Craft[category][objectName][level].ATK >= 1) reward.push(`${Emotes.ATK} ATK : ${player.data.ATK} => **${player.data.ATK + Number(Craft[category][objectName][level].ATK)}**`);
        if (Craft[category][objectName][level].DEF >= 1) reward.push(`${Emotes.DEF} DEF : ${player.data.DEF} => **${player.data.DEF + Number(Craft[category][objectName][level].DEF)}**`);
    
        for (const ressource in currentObject.ressource) {
            if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(currentObject.ressource[ressource]-player.ress[ressource.toLowerCase()]))})`);
            if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.checked})`);
        }
    // }

    if (objectName !== "torch") {
        embed.setTitle(`${lang.craft.upgrade.replace("%a", `"${currentObjectTitle.name}"`).replace("%n", `"${currentObject.name}"`)}`);
    }

    const maxEnergy = Craft.objects.ring[player.items.ring].energy;
    if (objectName === "pickaxe") reward.push(`💪 Power : ${player.data.power} => **${player.data.power + Number(Craft.tools.pickaxe[level].power)}**`);
    if (objectName === "ring") reward.push(`⚡Energy : ${maxEnergy} => **${currentObject.energy}**\n⏲️ Energy Cooldown : ${moment.duration(player.data.energyCooldown).format("s")}s => **${moment.duration(currentObject.cooldown).format("s")}s**`)

    embed.addField(`**${lang.craft.cost}**`, txt.join("\n"));

    let rewardLength = reward.join("\n") ? reward.length >= 1 : reward.join("\n");
    if (rewardLength) embed.addField(`**Reward**`, `${emote} ${currentObject.name}\n${reward.join("\n")}`);
    else embed.addField(`**Reward**`, `${emote} ${currentObject.name}`);

    for (let ressource in currentObject.ressource) {
        let ress = currentObject.ressource[ressource];
        // if (objectName === "torch") ress = currentObject.ressource[ressource] * amount;
        // else ress = currentObject.ressource[ressource];

        if (player.ress[ressource.toLowerCase()] < ress) {
            validButton.setDisabled(true);
            cancelButton.setDisabled(true);

            return interaction.reply({ embeds: [embed], components: [buttonRow] });
        }
        sql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`);
    }

    const msg = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });

    const filter = (interact) => interact.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', button => {
        validButton.setDisabled(true);
        cancelButton.setDisabled(true);
        switch(button.customId) {
            case "valid":
                con.query(`UPDATE data SET ATK = ${player.data.ATK + Number(currentObject.ATK)}, DEF = ${player.data.DEF + Number(currentObject.DEF)}, power = ${currentObject.power > 0 ? player.data.power + Number(currentObject.power) : player.data.power} WHERE userid = ${interaction.user.id}`);
                con.query(`UPDATE ress SET ${sql.join(',')} WHERE userid = ${interaction.user.id}`);
                switch (objectName) {
                    case "torch":                                       //+ Number(amount)
                        con.query(`UPDATE ress SET torch = ${player.ress.torch} WHERE userid = ${interaction.user.id}`);
                        break;

                    case "ring":
                        con.query(`UPDATE data SET energyCooldown = ${currentObject.cooldown} WHERE userid = ${interaction.user.id}`);
                        con.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${interaction.user.id}`);
                        break;
                
                    default:
                        con.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${interaction.user.id}`);
                        break;
                }
                if (category === "armors") {
                    switch (level) {
                        case 1:
                            con.query(`UPDATE slots SET slot_a_${objectName} = 0 WHERE userid = ${interaction.user.id}`);
                            break;
                        case 2:
                            con.query(`UPDATE slots SET slot_b_${objectName} = 0 WHERE userid = ${interaction.user.id}`);
                            break;
                        case 3:
                            con.query(`UPDATE slots SET slot_c_${objectName} = 0 WHERE userid = ${interaction.user.id}`);
                            break;
                    }
                }
                const torch = objectName ? objectName === "torch" : true;
                if (torch) {
                    collector.stop();                                       //${amount} 
                    return interaction.channel.send(`${lang.craft.done.replace("%s", `**${currentObject.name}**`)}.`)
                } else {
                    collector.stop();
                    return interaction.channel.send(`${lang.craft.done.replace("%s", `**${currentObject.name}**`)}.`);
                }

            case "cancel":
                collector.stop();
                return interaction.channel.send(`${lang.craft.canceled}`);
        }
    });

    collector.on('end', () => {
        msg.edit({ components: [], embeds: [embed] })
    });
}