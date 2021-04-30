const { nFormatter } = require('../utils/u.js');
const Discord        = require('discord.js'),
    Emotes           = require('../utils/emotes.json');

module.exports = async function manageCraft(con, player, message, category, objectName, emote) {
    const Craft = require(`../utils/items/${player.data.lang}.json`);
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];

    const level = Math.floor(player.items[objectName])+1;
    const levelTitle = Math.floor(player.items[objectName]);

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    var currentObject = [];
    var currentObjectTitle = [];
    if (category === "objects" && objectName === "torch") {
        let filter = (m) => m.author.id === message.author.id;

        message.channel.send(`${lang.craft.typingNumber}`);
        const collector = new Discord.MessageCollector(message.channel, filter, {
            time: 30000
        });

        collector.on("collect", async (response) => {
            const reponse = response.content;

            if (isNaN(reponse) || reponse == 0) {
                message.channel.send(`${lang.craft.validNumber}`);
            } else if (reponse > 0) {
                collector.stop();
                let currentObject = Craft[category][objectName][0];

                embed.setTitle(`Craft "${currentObject.name}" x${reponse} ?`)

                let txt = [];
                for (const ressource in currentObject.ressource) {
                    if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource] * reponse) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * reponse)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor((currentObject.ressource[ressource] * reponse)-player.ress[ressource.toLowerCase()]))})`);
                    if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource] * reponse) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * reponse)} (${Emotes.checked})`);
                }

                embed.addField(`**${lang.craft.cost}**`, txt);
                embed.addField("**Reward**", `${emote} ${currentObject.name} x**${reponse}**`)

                const msg = await message.channel.send(embed);
                await msg.react(react[0]);
                await msg.react(react[1]);

                let filterReactions = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

                msg.awaitReactions(filterReactions, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    let reaction = collected.first();

                    switch (reaction.emoji.id) {
                        case react[0]:
                            let need = [];
                            let resssql = [];

                            for (var ressource in currentObject.ressource) {
                                if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) need.push(`sorry bro`);
                                resssql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource] * reponse}`);
                            }
                            if (need.length >= 1) return message.channel.send(`${lang.craft.notEnoughRess}`);

                            con.query(`UPDATE ress SET ${resssql.join(',')}, ${objectName} = ${objectName + Number(reponse)} WHERE userid = ${message.author.id}`);
                            msg.delete();

                            return message.channel.send(`${lang.craft.done} **${currentObject.name}** x${reponse} !`);

                        case react[1]:
                            return message.channel.send(`${lang.craft.canceled}`);
                    }
                }).catch(() => {
                    msg.reactions.removeAll();
                });
            }
        })
    } else {
        if (!Craft[category][objectName][level]) return message.channel.send(`${lang.craft.maxLevel}`);
        currentObject = Craft[category][objectName][level];
        currentObjectTitle = Craft[category][objectName][levelTitle];
    }
    embed.setTitle(`${lang.craft.upgrade} "${currentObjectTitle.name}" ${lang.craft.to} "${currentObject.name}" ?`)

    let txt = [];
    let reward = [];
    for (const ressource in currentObject.ressource) {
        if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(currentObject.ressource[ressource]-player.ress[ressource.toLowerCase()]))})`);
        if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.checked})`);
    }
    
    if (Craft[category][objectName][level].ATK >= 1) reward.push(`${Emotes.ATK} ATK : ${player.data.ATK} => **${player.data.ATK + Number(Craft[category][objectName][level].ATK)}**`);
    if (Craft[category][objectName][level].DEF >= 1) reward.push(`${Emotes.DEF} DEF : ${player.data.DEF} => **${player.data.DEF + Number(Craft[category][objectName][level].DEF)}**`);
    if (objectName === "pickaxe") reward.push(`💪 Power : ${player.data.power} => **${player.data.power + Number(Craft.tools.pickaxe[level].power)}**`);

    embed.addField(`**${lang.craft.cost}**`, txt);
    embed.addField(`**Reward**`, `${emote} ${currentObject.name}\n${reward.join("\n")}`)

    const msg = await message.channel.send(embed);

    let need = [];
    let resssql = [];

    for (var ressource in currentObject.ressource) {
        if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) {
            need.push(`sorry bro`);
            return;
        }
        resssql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`);
    }

    await msg.react(react[0]);
    await msg.react(react[1]);

    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
        let reaction = collected.first();

        switch(reaction.emoji.id) {
            case react[0]:
                if (need.length >= 1) return message.channel.send(`${lang.craft.notEnoughRess}`);
                
                con.query(`UPDATE data SET ATK = ${player.data.ATK + Number(currentObject.ATK)}, DEF = ${player.data.DEF + Number(currentObject.DEF)}, power = ${currentObject.power > 0 ? player.data.power + Number(currentObject.power) : player.data.power} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);

                return message.channel.send(`${lang.craft.done} **${currentObject.name}** !`);

            case react[1]:
                return message.channel.send(`${lang.craft.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}