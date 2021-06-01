const { nFormatter } = require('../utils/u.js');
const Discord        = require('discord.js'),
    Emotes           = require('../utils/emotes.json'),
    moment           = require('moment');

module.exports = async function manageCraft(con, player, args, message, category, objectName, emote) {
    const Craft = require(`../utils/items/${player.data.lang}.json`);
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];

    const level = Math.floor(player.items[objectName])+1;
    const levelTitle = Math.floor(player.items[objectName]);
    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    var currentObject = [];
    var currentObjectTitle = [];
    let txt = [];
    let reward = [];
    let need = [];
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

    const msg = await message.channel.send(embed);

    for (var ressource in currentObject.ressource) {
        if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) {
            need.push(`sorry bro`);
            return;
        }
        sql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`);
    }

    await msg.react(react[0]);
    await msg.react(react[1]);

    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
        let reaction = collected.first();

        switch(reaction.emoji.id) {
            case react[0]:
                if (need.length >= 1) return message.reply(`${lang.craft.notEnoughRess}`);
                
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
                const torch = objectName ? objectName === "torch" : true;
                if (torch) return message.channel.send(`${lang.craft.done.replace("%s", `${amount} **${currentObject.name}**`)}.`)
                else return message.channel.send(`${lang.craft.done.replace("%s", `**${currentObject.name}**`)}.`);

            case react[1]:
                return message.channel.send(`${lang.craft.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}