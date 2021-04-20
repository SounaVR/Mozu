const { nFormatter } = require('../utils/u.js');
const Discord        = require('discord.js'),
    Emotes           = require('../utils/emotes.json');

module.exports = async function manageEnchant(client, con, player, message, category, object, objectName) {
    const Enchant = require(`../utils/items/enchant.json`);
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ['780222056007991347', '780222833808506920'];

    const level = Math.floor(player.enchant[objectName])+1;

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    //const objectRessource = Enchant[category][object][1];
    const getNeededRessource = (player.enchant[objectName] * player.enchant[objectName] * 5)+1;

    embed.setTitle(`Enchant your item ?`)
    let txt = [];

    if (player.ress[`rune_${object}`] < getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(getNeededRessource-player.ress[`rune_${object}`]))})`);
    if (player.ress[`rune_${object}`] >= getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.checked})`);

    embed.addField("**Cost**", txt);

    const msg = await message.channel.send(embed);

    await msg.react(react[0]);
    await msg.react(react[1]);

    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
        let reaction = collected.first();

        switch(reaction.emoji.id) {
            case react[0]:
                msg.delete();
                let need = [];
                let resssql = [];

                if (player.ress[`rune_${object}`] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`rune_${object} = rune_${object} - ${getNeededRessource}`);

                if (need.length >= 1) return message.channel.send(`${lang.enchant.notEnoughRess}`);

                con.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE data SET ATK = ${player.data.ATK + Number(Enchant[category][object][0].ATK)}, DEF = ${player.data.DEF + Number(Enchant[category][object][0].DEF)} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE enchant SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);

                return message.channel.send(`${lang.enchant.enchantSuccess} : **${level}** !`);

            case react[1]:
                msg.delete();
                return message.channel.send(`${lang.enchant.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}