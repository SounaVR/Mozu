const Discord = require('discord.js');
const Default = require('../../utils/default.json');
const Emotes  = require('../../utils/emotes.json');

function manageGive(client, con, args, player, member, message, objectName, objectAliases) {
    var con = client.connection
    const lang = require(`../../utils/text/${player.data.lang}.json`)
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
                        if (player.data[objectName] < args[2]) {
                            e.reactions.removeAll();
                            return e.edit(`${lang.give.notEnoughRess}`)
                        }
                        con.query(`UPDATE data SET ${objectName} = ${player.data[objectName] - args[2]} WHERE userid = ${userid}`)
                        con.query(`UPDATE data SET ${objectName} = ${member.data[objectName] + Number(args[2])} WHERE userid = ${user.id}`)
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

module.exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`)
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const user = message.mentions.users.first();
    const userid = message.author.id;

    if (!args[0]) return message.channel.send(`${lang.give.correctUsage}`)
    if (!args[1]) return message.channel.send(`${lang.give.correctUsage}`)
    if (!args[2]) return message.channel.send(`${lang.give.specifyAmount}`)
    if (user.id === userid) return message.channel.send(`${lang.give.giveToSelf}`)
    if (user.id === client.user.id) return message.channel.send(`${lang.give.giveToMozu}`)
    if (user.bot) return message.channel.send(`${lang.give.giveToOtherBots}`)
    var member = await getUser(con, user.id);

    manageGive(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones']);
    manageGive(client, con, args, player, member, message, 'coal', ['charbon']);
    manageGive(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers']);
    manageGive(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons']);
    manageGive(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds']);
    manageGive(client, con, args, player, member, message, 'malachite', ['malachites']);
};

module.exports.help = {
    name: "give",
    description_fr: "Pour donner des objets",
    description_en: "To give items",
    usage_fr: "<@quelqu'un> <objet> <quantité>",
    usage_en: "<@someone> <item> <quantity>",
    category: "RPG",
    aliases: ["g", "gi"]
};
