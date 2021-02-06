const Discord = require('discord.js');
const Default = require('../../utils/default.json');
const Emotes  = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;
    const user = getUserFromMention(args[0]);

    if (!args[1]) return message.channel.send(`💳 ► ${lang.bal.actualBal} **${player.data.money}**${Emotes.cash} ${lang.bal.actualBal2}`)
    if (args[1] > 0) {
      if (user.id === userid) return message.channel.send(`${lang.give.giveToSelf}`)
      if (user.bot) return message.channel.send(`${lang.give.giveToOtherBots}`)
      const embed = new Discord.MessageEmbed()
      .setColor(message.member.displayColor)
      .setTitle("**[TRANSFERT]**")
      .setDescription(`Statut : **En attente** ${Emotes.loading}`)
      .addField(`Par:`, `${message.author.username}`, true)
      .addField(`Vers:`, `${user.username}`, true)
      .addField(`Montant:`, `**${Math.floor(args[1])}**${Emotes.cash}`, true)
      message.channel.send(embed).then(async e => {
        await e.react("✅");
        await e.react("❌");

        const filter = (reaction, user) => {
          return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        e.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
        .then(async collected => {
          const reaction = collected.first();

        if (reaction.emoji.name === '✅') {
          var player = await getPlayer(con, message.author.id);
          if (player.data.money < args[1]) {
            e.reactions.removeAll();
            return e.edit(`${lang.gift.notEnoughMoney} **${Math.abs(args[1] - player.data.money)}**${Emotes.cash}`)
          }
          con.query(`UPDATE data SET money = ? WHERE userid = ?`, [player.data.money - Number(args[1]), userid])
          con.query(`SELECT * FROM data WHERE userid = ?`, [user.id], function(err, rows) {
            if (err) throw err;
            money = rows[0];
            if (money === undefined) {
              return e.edit(`${lang.gift.unknown}`)
            } else {
              con.query('UPDATE data SET money = ? WHERE userid = ?', [money.money + Number(args[1]), user.id])
            }
          })

          var width = 20;
          while(width <= 100) {
            const embedProcessing = new Discord.MessageEmbed()
            .setColor(message.member.displayColor)
            .setTitle("**[TRANSFERT]**")
            .setDescription(`Statut : **En cours** ${Emotes.loading}`)
            .addField(`Par:`, `${message.author.username}`, true)
            .addField(`Vers:`, `${user.username}`, true)
            .addField(`Montant:`, `**${Math.floor(args[1])}**${Emotes.cash}`, true)
            .addField(`Avancée:`, `**${width}% effectués** ${Emotes.loading}`, true)
            setTimeout(() => {
              e.edit(embedProcessing)
            }, 1000 * width/20)
            width += 20;
          }

          setTimeout(() => {
          const embedProcessing = new Discord.MessageEmbed()
            .setColor(message.member.displayColor)
            .setTitle("**[TRANSFERT TERMINÉ]**")
            .addField(`Par:`, `${message.author.username}`, true)
            .addField(`Vers:`, `${user.username}`, true)
            .addField(`Montant:`, `**${args[1]}**${Emotes.cash}`, true)
            .addField(`Avancée:`, `**100% effectués**`, true)
            e.edit(embedProcessing)
          }, 1000 * 7)
        } else if (reaction.emoji.name === '❌') {
          e.delete();
          message.channel.send(`${lang.gift.cancel}`);
        }
        e.reactions.removeAll();
      }).catch(collected => {
        e.reactions.removeAll();
      })
    });
    } else {
        return message.channel.send(`${lang.gift.invalidAmount}`)
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
