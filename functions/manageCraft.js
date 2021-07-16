const { nFormatter } = require('../utils/u.js');
const { MessageButton } = require('discord-buttons');
const Discord        = require('discord.js'),
    Emotes           = require('../utils/emotes.json'),
    moment           = require('moment');

module.exports = async function manageCraft(con, player, args, message, category, objectName, emote) {
    const Craft = require(`../utils/items/${player.data.lang}.json`);
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];

    const level = Math.floor(player.items[objectName])+1;
    const levelTitle = Math.floor(player.items[objectName]);

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    let validButton = new MessageButton().setStyle("green").setEmoji(react[0]).setID("valid");
    let cancelButton = new MessageButton().setStyle("red").setEmoji(react[1]).setID("cancel");

    var currentObject = [];
    var currentObjectTitle = [];
    let txt = [];
    let reward = [];
    let sql = [];
    var amount;
    
    if (objectName === "torch") {
        currentObject = Craft[category][objectName][0];
        if (!args[1] || args[1] == 1) {
            amount = 1;
        } else if (args[1] >= 2) {
            amount = args[1];
        } else {
            return message.reply(`${lang.craft.invalidNumber}`);
        }
        embed.setTitle(`${lang.craft.craft} ${amount} "${currentObject.name}" ?`);

        for (const ressource in currentObject.ressource) {
            if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource] * amount) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * amount)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor((currentObject.ressource[ressource] * amount)-player.ress[ressource.toLowerCase()]))})`);
            if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource] * amount) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * amount)} (${Emotes.checked})`);
        }
    } else {
        if (!Craft[category][objectName][level]) return message.reply(`${lang.craft.maxLevel}`);

        currentObject = Craft[category][objectName][level];
        currentObjectTitle = Craft[category][objectName][levelTitle];

        if (Craft[category][objectName][level].ATK >= 1) reward.push(`${Emotes.ATK} ATK : ${player.data.ATK} => **${player.data.ATK + Number(Craft[category][objectName][level].ATK)}**`);
        if (Craft[category][objectName][level].DEF >= 1) reward.push(`${Emotes.DEF} DEF : ${player.data.DEF} => **${player.data.DEF + Number(Craft[category][objectName][level].DEF)}**`);
    
        for (const ressource in currentObject.ressource) {
            if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(currentObject.ressource[ressource]-player.ress[ressource.toLowerCase()]))})`);
            if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.checked})`);
        }
    }

    if (objectName !== "torch") {
        embed.setTitle(`${lang.craft.upgrade.replace("%a", `"${currentObjectTitle.name}"`).replace("%n", `"${currentObject.name}"`)}`);
    }

    const maxEnergy = Craft.objects.ring[player.items.ring].energy;
    if (objectName === "pickaxe") reward.push(`💪 Power : ${player.data.power} => **${player.data.power + Number(Craft.tools.pickaxe[level].power)}**`);
    if (objectName === "ring") reward.push(`⚡Energy : ${maxEnergy} => **${currentObject.energy}**\n⏲️ Energy Cooldown : ${moment.duration(player.data.energyCooldown).format("s")}s => **${moment.duration(currentObject.cooldown).format("s")}s**`)

    embed.addField(`**${lang.craft.cost}**`, txt);

    let rewardLength = reward.join("\n") ? reward.length >= 1 : reward.join("\n");
    if (rewardLength) embed.addField(`**Reward**`, `${emote} ${currentObject.name}\n${reward.join("\n")}`);
    else embed.addField(`**Reward**`, `${emote} ${currentObject.name}`);

    for (var ressource in currentObject.ressource) {
        let ress;
        if (objectName === "torch") ress = currentObject.ressource[ressource] * amount;
        else ress = currentObject.ressource[ressource];

        if (player.ress[ressource.toLowerCase()] < ress) {
            validButton.setDisabled(true);
            cancelButton.setDisabled(true);
        }
        sql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`);
    }
    const msg = await message.channel.send({embed: embed, buttons: [validButton, cancelButton]});

    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = msg.createButtonCollector(filter, { time: 30000 });

    collector.on('collect', button => {
        validButton.setDisabled(true);
        cancelButton.setDisabled(true);
        switch(button.id) {
            case "valid":
                con.query(`UPDATE data SET ATK = ${player.data.ATK + Number(currentObject.ATK)}, DEF = ${player.data.DEF + Number(currentObject.DEF)}, power = ${currentObject.power > 0 ? player.data.power + Number(currentObject.power) : player.data.power} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE ress SET ${sql.join(',')} WHERE userid = ${message.author.id}`);
                switch (objectName) {
                    case "torch":
                        con.query(`UPDATE ress SET torch = ${player.ress.torch + Number(amount)} WHERE userid = ${message.author.id}`);
                        break;

                    case "ring":
                        con.query(`UPDATE data SET energyCooldown = ${currentObject.cooldown} WHERE userid = ${message.author.id}`);
                        con.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);
                        break;
                
                    default:
                        con.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);
                        break;
                }
                if (category === "armors") {
                    switch (level) {
                        case 1:
                            con.query(`UPDATE slots SET slot_a_${objectName} = 0 WHERE userid = ${message.author.id}`);
                            break;
                        case 2:
                            con.query(`UPDATE slots SET slot_b_${objectName} = 0 WHERE userid = ${message.author.id}`);
                            break;
                        case 3:
                            con.query(`UPDATE slots SET slot_c_${objectName} = 0 WHERE userid = ${message.author.id}`);
                            break;
                    }
                }
                const torch = objectName ? objectName === "torch" : true;
                if (torch) {
                    collector.stop();
                    return message.channel.send(`${lang.craft.done.replace("%s", `${amount} **${currentObject.name}**`)}.`)
                } else {
                    collector.stop();
                    return message.channel.send(`${lang.craft.done.replace("%s", `**${currentObject.name}**`)}.`);
                }

            case "cancel":
                collector.stop();
                return message.channel.send(`${lang.craft.canceled}`);
        }
    })

    collector.on('end', () => {
        msg.edit(embed, { button: null })
    })

}