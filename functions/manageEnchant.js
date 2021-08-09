const { nFormatter } = require('../utils/u.js');
const Discord        = require('discord.js'),
    Emotes           = require('../utils/emotes.json');


//todo : buttons
module.exports = async function manageEnchant(client, con, player, message, category, object, objectName) {
    const Enchant = require(`../utils/items/enchant.json`);
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ['780222056007991347', '780222833808506920'];

    if (player.items[object] == "0") return message.channel.send(lang.enchant.levelTooLow);

    const level = Math.floor(player.enchant[objectName])+1;

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

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

    embed.addField(`**${lang.craft.cost}**`, txt.join("\n"));
    embed.addField("**Reward**", `${Emotes.enchant[`rune_${object}`]} ${object} enchant level : ${level - 1} => **${level}**\n${reward.join("\n")}`);

    const msg = await message.channel.send({ embeds: [embed] });

    if (player.ress[`rune_${object}`] < getNeededRessource) return;

    await msg.react(react[0]);
    await msg.react(react[1]);

    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    msg.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
    .then(async collected => {
        let reaction = collected.first();

        switch(reaction.emoji.id) {
            case react[0]:
                let need = [];
                let resssql = [];

                if (player.ress[`rune_${object}`] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`rune_${object} = rune_${object} - ${getNeededRessource}`);

                if (need.length >= 1) return message.reply(`${lang.enchant.notEnoughRess}`);

                con.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE data SET ATK = ${player.data.ATK + Number(Enchant[category][object][0].ATK)}, DEF = ${player.data.DEF + Number(Enchant[category][object][0].DEF)} WHERE userid = ${message.author.id}`);
                if (object === "pickaxe") con.query(`UPDATE data SET power = ${player.data.power + Number(Enchant.tools.pickaxe[0].power)}`)
                con.query(`UPDATE enchant SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);

                message.channel.send(`${lang.enchant.enchantSuccess.replace("%s", `**${level}**`)}`);
                msg.reactions.removeAll();

            case react[1]:
                msg.reactions.removeAll();
                return message.channel.send(`${lang.enchant.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}