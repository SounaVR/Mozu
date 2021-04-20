const Emotes  = require('../utils/emotes.json');

module.exports = function manageGive(client, con, args, player, member, message, objectName, objectAliases) {
    var con = client.connection
    const lang = require(`../utils/text/${player.data.lang}.json`)
    const user = message.mentions.users.first();
    const userid = message.author.id;

    if (args[1] && objectAliases.includes(args[1].toLowerCase()) || objectName.includes(args[1].toLowerCase())) {
        args[2] = Math.floor(args[2])

        if (args[2] > 0) {
            message.channel.send(`${lang.give.wantGive} **${args[2]} ${lang.inventory[objectName]}**${Emotes[objectName]} ${lang.give.wantGiveTo} **${user}** ?`).then(async e => {
                await e.react("✅");
                await e.react("❌");

                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                e.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
                .then(async collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '✅') {
                        if (player.ress[objectName] < args[2]) {
                            e.reactions.removeAll();
                            return e.edit(`${lang.give.notEnoughRess}`)
                        }
                        con.query(`UPDATE ress SET ${objectName} = ${player.ress[objectName] - args[2]} WHERE userid = ${userid}`)
                        con.query(`UPDATE ress SET ${objectName} = ${member.ress[objectName] + Number(args[2])} WHERE userid = ${user.id}`)
                        e.edit(`${lang.give.giveSuccess} **${args[2]} ${lang.inventory[objectName]}**${Emotes[objectName]} ${lang.give.giveSuccessTo} **${user}** !`)
                    } else if (reaction.emoji.name === '❌') {
                        e.edit(`${lang.give.canceled}`);
                    }
                    e.reactions.removeAll();
                }).catch(collected => {
                    e.reactions.removeAll();
                })
            });
        } else {
        return message.channel.send(`${lang.give.needSpecifyAmount}`)
        }
    }
}