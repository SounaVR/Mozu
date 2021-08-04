const Emotes  = require('../utils/emotes.json');

module.exports = function manageGive(client, con, args, player, member, message, objectName, objectAliases) {
    var con = client.connection
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];
    const user = message.mentions.users.first();
    const userid = message.author.id;

    if (args[1] && objectAliases.includes(args[1].toLowerCase()) || objectName.includes(args[1].toLowerCase())) {
        if (args[2] > 0) {
            message.reply(`${lang.give.wantGive.replace("%s", `**${args[2]} ${lang.inventory[objectName]}**${Emotes[objectName]}`).replace("%u", user)}`).then(async e => {
                await e.react(react[0]);
                await e.react(react[1]);

                const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

                e.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
                .then(async collected => {
                    const reaction = collected.first();

                    switch (reaction.emoji.id) {
                        case react[0]:
                            if (player.ress[objectName] < args[2]) {
                                e.reactions.removeAll();
                                return e.edit(`${Emotes.cancel} ${lang.give.notEnoughRess}`);
                            }
                            con.query(`UPDATE ress SET ${objectName} = ${player.ress[objectName] - args[2]} WHERE userid = ${userid}`);
                            con.query(`UPDATE ress SET ${objectName} = ${member.ress[objectName] + Number(args[2])} WHERE userid = ${user.id}`);
                            e.edit(`${Emotes.checked} ${lang.give.giveSuccess.replace("%m", `**${args[2]} ${lang.inventory[objectName]}**${Emotes[objectName]}`).replace("%u", `**${user}**`)}`);
                            break;
                        case react[1]:
                            e.edit(`${Emotes.cancel} ${lang.give.canceled}`);
                            break;
                    }
                    e.reactions.removeAll();
                }).catch(err => {
                    console.error(err);
                    e.reactions.removeAll();
                })
            });
        }
    }
}