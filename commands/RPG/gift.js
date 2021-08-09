const { nFormatter } = require("../../utils/u.js");
const Discord = require('discord.js'),
Emotes        = require('../../utils/emotes.json'),
Default       = require('../../utils/default.json');

//todo : buttons

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];
    const user = message.mentions.users.first();
    const userid = message.author.id;
    
    if (!user) return message.channel.send(`💳 ► ${lang.bal.actualBal.replace("%s", `**${nFormatter(player.data.money)}**${Emotes.cash}`)}`);
    if (!args[1]) return message.reply(`${lang.gift.correctUsage.replace("%s", client.config.prefix)}`);
    if (args[1] > 0) {
        if (user.id === userid) return message.reply(`${lang.gift.giveToSelf}`)
        if (user.bot) return message.reply(`${lang.gift.giveToOtherBots}`)

        const embed = new Discord.MessageEmbed()
            .setColor(message.member.displayColor)
            .setTitle(lang.gift.transfer)
            .setDescription(`${lang.gift.state} ${lang.gift.state_pending} ${Emotes.loading}`)
            .addField(`${lang.gift.from}`, `${message.author}`, true)
            .addField(`${lang.gift.for}`, `${user}`, true)
            .addField(`${lang.gift.amount}`, `**${Math.floor(args[1])}**${Emotes.cash}`, true)

        message.channel.send({ embeds: [embed] }).then(async e => {
            await e.react(react[0]);
            await e.react(react[1]);

            const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

            e.awaitReactions({filter, max: 1, time: 45000, errors: ['time'] })
            .then(async collected => {
                const reaction = collected.first();

                switch (reaction.emoji.id) {
                    case react[0]:
                        var player = await getPlayer(con, message.author.id);
                        if (player.data.money < args[1]) {
                            e.reactions.removeAll();
                            e.delete();
                            return message.reply(`${lang.gift.notEnoughMoney.replace("%s", `**${Math.abs(args[1] - player.data.money)}**${Emotes.cash}`)}`)
                        }
                        con.query(`UPDATE data SET money = ${player.data.money - Number(args[1])} WHERE userid = ${userid}`);
                        con.query(`SELECT * FROM data WHERE userid = ${user.id}`, function(err, rows) {
                            if (err) throw err;
                            money = rows[0];
                            if (money === undefined) {
                                return e.edit(`${lang.gift.unknownUser}`);
                            } else {
                                con.query(`UPDATE data SET money = ${money.money + Number(args[1])} WHERE userid = ${user.id}`);
                            }
                        });

                        var width = 20;
                        while(width <= 100) {
                            const embedProcessing = new Discord.MessageEmbed()
                                .setColor(message.member.displayColor)
                                .setTitle(lang.gift.transfer)
                                .setDescription(`${lang.gift.state} ${lang.gift.state_inProgress} ${Emotes.loading}`)
                                .addField(`${lang.gift.from}`, `${message.author}`, true)
                                .addField(`${lang.gift.for}`, `${user}`, true)
                                .addField(`${lang.gift.amount}`, `**${Math.floor(args[1])}**${Emotes.cash}`, true)
                                .addField(`${lang.gift.progress}`, `**${width}% ${lang.gift.completed}** ${Emotes.loading}`, true)
                            setTimeout(() => {
                            e.edit({ embeds: [embedProcessing] })
                            }, 1000 * width/20)
                            width += 20;
                        }

                        setTimeout(() => {
                            const embedProcessing = new Discord.MessageEmbed()
                                .setColor(message.member.displayColor)
                                .setTitle(lang.gift.transfer)
                                .setDescription(`${lang.gift.state} ${lang.gift.state_done} ${Emotes.checked}`)
                                .addField(`${lang.gift.from}`, `${message.author}`, true)
                                .addField(`${lang.gift.for}`, `${user}`, true)
                                .addField(`${lang.gift.amount}`, `**${args[1]}**${Emotes.cash}`, true)
                                .addField(`${lang.gift.progress}`, `**100% ${lang.gift.completed}**`, true)
                                e.edit({ embeds: [embedProcessing] })
                            }, 1000 * 7)
                        break;
                    case react[1]:
                        e.delete()
                        const embedCanceled = new Discord.MessageEmbed()
                            .setColor(message.member.displayColor)
                            .setTitle(lang.gift.transfer)
                            .setDescription(`${lang.gift.state} ${lang.gift.state_canceled} ${Emotes.cancel}`)
                            .addField(`${lang.gift.from}`, `${message.author}`, true)
                            .addField(`${lang.gift.for}`, `${user}`, true)
                            .addField(`${lang.gift.amount}`, `**${Math.floor(args[1])}**${Emotes.cash}`, true)
                        return message.channel.send({ embeds: [embedCanceled] });
                }
                e.reactions.removeAll();   
            }).catch(collected => {
                e.delete()
                const embedCanceled = new Discord.MessageEmbed()
                    .setColor(message.member.displayColor)
                    .setTitle(lang.gift.transfer)
                    .setDescription(`${lang.gift.state} ${lang.gift.state_timedOut} ${Emotes.cancel}`)
                    .addField(`${lang.gift.from}`, `${message.author}`, true)
                    .addField(`${lang.gift.for}`, `${user}`, true)
                    .addField(`${lang.gift.amount}`, `**${Math.floor(args[1])}**${Emotes.cash}`, true)
                return message.channel.send({ embeds: [embedCanceled] });
            })
        });
    } else {
        return message.reply(`${lang.gift.invalidAmount}`)
    }
};

exports.help = {
    name: "gift",
    description_fr: "Donner de l'argent à un autre joueur",
    description_en: "Give money to another player",
    usage_fr: "<@quelqu'un> <Nombre>",
    usage_en: "<@someone> <Number>",
    category: "RPG",
    aliases: ["kdo", "pay"]
};
