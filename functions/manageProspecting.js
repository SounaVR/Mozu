const { nFormatter } = require('../utils/u');
const Discord        = require('discord.js'),
    Emotes           = require('../utils/emotes.json');

module.exports = async function manageProspecting(client, con, player, message, ore, quantity, gem, stat) {
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ['780222056007991347', '780222833808506920'];

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    const getNeededRessource = quantity * 10000;

    embed.setTitle(`Do you want to prospect that ?`)
    let txt = [];

    if (player.ress[ore] < getNeededRessource) txt.push(`${Emotes[ore]} ${ore} : ${nFormatter(getNeededRessource)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(getNeededRessource-player.ress[ore]))})`);
    if (player.ress[ore] >= getNeededRessource) txt.push(`${Emotes[ore]} ${ore} : ${nFormatter(getNeededRessource)} (${Emotes.checked})`);

    embed.addField(`**${lang.craft.cost}**`, txt);
    embed.addField("**Reward**", `${Emotes[gem]} ${gem} x${quantity}\n*${stat}*`)

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

                if (player.data[ore] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`${ore} = ${ore} - ${getNeededRessource}`);

                if (need.length >= 1) return message.channel.send(`${lang.prospect.notEnoughRess}`);

                con.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE prospect SET ${gem} = ${player.prospect[gem] + Number(quantity)} WHERE userid = ${message.author.id}`);

                return message.channel.send(`${lang.prospect.success} : **${gem}** x${quantity} !`);

            case react[1]:
                msg.delete();
                return message.channel.send(`${lang.prospect.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}