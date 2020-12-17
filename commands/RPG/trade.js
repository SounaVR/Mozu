const Discord = require('discord.js');
const Default = require('../../utils/default.json');

function manageTrade(client, con, args, player, member, message, objectName, objectAliases, objectName2, objectAliases2) {
  var con = client.connection
  const lang = require(`../../utils/text/${player.data.lang}.json`)
  const userid = message.author.id;

  function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return client.users.cache.get(mention);
    }
  }
  const someone = getUserFromMention(args[2]);

  if (args[0] && objectAliases.includes(args[0].toLowerCase()) || objectName.includes(args[0].toLowerCase())) {
    if (args[3] && objectAliases2.includes(args[3].toLowerCase()) || objectName2.includes(args[3].toLowerCase())) {
    args[1] = Math.floor(args[1])
    args[4] = Math.floor(args[4])

    if (args[1] > 0) {
      if (args[4] > 0) {
        message.channel.send(`**[TRANSACTION]**\nJoueur **<@${message.author.id}>** **propose de donner** [${args[1]} **${lang.inventory[objectName]}${Default.emotes[objectName]}**]\nJoueur **${someone}** **est invité à donner** [${args[4]} **${lang.inventory[objectName2]}${Default.emotes[objectName2]}**]\nStatut : **En attente** ${Default.emotes.loading}`).then(async e => {
            await e.react("✅");
            await e.react("❌");

            const filter = (reaction, user) => {
              return ['✅', '❌'].includes(reaction.emoji.name) && user.id === (message.author.id && someone.id);
            };

            e.awaitReactions(filter, { max: 1, time: 45000, errors: ['time']})
            .then(async collected => {
              const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
              if (player.data[objectName] < args[1]) {
                e.reactions.removeAll();
                return e.edit(`${lang.trade.failed}`)
              }
              if (member.data[objectName2] < args[4]) {
                e.reactions.removeAll();
                return e.edit(`${lang.trade.failed2}`)
              }
              con.query(`UPDATE data SET ${objectName} = ${player.data[objectName] - (args[1])} WHERE userid = ${userid}`)
              con.query(`UPDATE data SET ${objectName2} = ${player.data[objectName2] + Number(args[4])} WHERE userid = ${userid}`)
              con.query(`UPDATE data SET ${objectName2} = ${member.data[objectName2] - (args[4])} WHERE userid = ${someone.id}`)
              con.query(`UPDATE data SET ${objectName} = ${member.data[objectName] + Number(args[1])} WHERE userid = ${someone.id}`)
              e.edit(`**[TRANSACTION]**\nJoueur **<@${message.author.id}>** **propose de donner** [${args[1]} **${lang.inventory[objectName]}${Default.emotes[objectName]}**]\nJoueur **${someone}** **est invité à donner** [${args[4]} **${lang.inventory[objectName2]}${Default.emotes[objectName2]}**]\nStatut : **Validé** ✅`);
              } else if (reaction.emoji.name === '❌') {
                e.edit(`**[TRANSACTION]**\nJoueur **<@${message.author.id}>** **propose de donner** [${args[1]} **${lang.inventory[objectName]}${Default.emotes[objectName]}**]\nJoueur **${someone}** **est invité à donner** [${args[4]} **${lang.inventory[objectName2]}${Default.emotes[objectName2]}**]\nStatut : **Annulé** ❌`);
              }
              e.reactions.removeAll();
            }).catch(collected => {
              e.edit(`**[TRANSACTION]**\nJoueur **<@${message.author.id}>** **propose de donner** [${args[1]} **${lang.inventory[objectName]}${Default.emotes[objectName]}**]\nJoueur **${someone}** **est invité à donner** [${args[4]} **${lang.inventory[objectName2]}${Default.emotes[objectName2]}**]\nStatut : **Time out** ❌`)
              e.reactions.removeAll();
            })
          });
        } else {
          return message.channel.send(`${lang.trade.error}`)
        }
      } else {
        return message.channel.send(`${lang.trade.error}`)
      }
    }
  }
}

module.exports.run = async (client, message, args, getPlayer, getUser) => {
  var con = client.connection
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
  const lang = require(`../../utils/text/${player.data.lang}.json`);
  const userid = message.author.id;

  function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return client.users.cache.get(mention);
    }
  }
  const someone = getUserFromMention(args[2]);
 
  if (!args[0]) return message.channel.send(`${lang.trade.correctU}`)
  if (!args[3]) return message.channel.send(`${lang.trade.correctU}`)

  if (!args[2]) return message.channel.send(`${lang.trade.correctU}`)

  if (!args[1]) return message.channel.send(`${lang.trade.correctU}`)
  if (!args[4]) return message.channel.send(`${lang.trade.correctU}`)
  if (someone.id === userid) return message.channel.send(`${lang.trade.self}`)
  if (someone.id === client.user.id) return message.channel.send(`${lang.trade.me}`)
  if (someone.bot) return message.channel.send(`${lang.trade.other}`)
  var member = await getUser(con, someone.id);
  

  manageTrade(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones'], 'stone', ['caillou', 'cailloux', 'stones']);
  manageTrade(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones'], 'coal', ['charbon']);
  manageTrade(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones'], 'copper', ['cuivre', 'cuivres', 'coppers']);
  manageTrade(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones'], 'iron', ['fer', 'fers', 'irons']);
  manageTrade(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones'], 'gold', ['or', 'ors', 'golds']);
  manageTrade(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones'], 'malachite', ['malachites']);

  manageTrade(client, con, args, player, member, message, 'coal', ['charbon'], 'stone', ['caillou', 'cailloux', 'stones']);
  manageTrade(client, con, args, player, member, message, 'coal', ['charbon'], 'coal', ['charbon']);
  manageTrade(client, con, args, player, member, message, 'coal', ['charbon'], 'copper', ['cuivre', 'cuivres', 'coppers']);
  manageTrade(client, con, args, player, member, message, 'coal', ['charbon'], 'iron', ['fer', 'fers', 'irons']);
  manageTrade(client, con, args, player, member, message, 'coal', ['charbon'], 'gold', ['or', 'ors', 'golds']);
  manageTrade(client, con, args, player, member, message, 'coal', ['charbon'], 'malachite', ['malachites']);

  manageTrade(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers'], 'stone', ['caillou', 'cailloux', 'stones']);
  manageTrade(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers'], 'coal', ['charbon']);
  manageTrade(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers'], 'copper', ['cuivre', 'cuivres', 'coppers']);
  manageTrade(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers'], 'iron', ['fer', 'fers', 'irons']);
  manageTrade(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers'], 'gold', ['or', 'ors', 'golds']);
  manageTrade(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers'], 'malachite', ['malachites']);

  manageTrade(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons'], 'stone', ['caillou', 'cailloux', 'stones']);
  manageTrade(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons'], 'coal', ['charbon']);
  manageTrade(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons'], 'copper', ['cuivre', 'cuivres', 'coppers']);
  manageTrade(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons'], 'iron', ['fer', 'fers', 'irons']);
  manageTrade(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons'], 'gold', ['or', 'ors', 'golds']);
  manageTrade(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons'], 'malachite', ['malachites']);

  manageTrade(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds'], 'stone', ['caillou', 'cailloux', 'stones']);
  manageTrade(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds'], 'coal', ['charbon']);
  manageTrade(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds'], 'copper', ['cuivre', 'cuivres', 'coppers']);
  manageTrade(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds'], 'iron', ['fer', 'fers', 'irons']);
  manageTrade(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds'], 'gold', ['or', 'ors', 'golds']);
  manageTrade(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds'], 'malachite', ['malachites']);

  manageTrade(client, con, args, player, member, message, 'malachite', ['malachites'], 'stone', ['caillou', 'cailloux', 'stones']);
  manageTrade(client, con, args, player, member, message, 'malachite', ['malachites'], 'coal', ['charbon']);
  manageTrade(client, con, args, player, member, message, 'malachite', ['malachites'], 'copper', ['cuivre', 'cuivres', 'coppers']);
  manageTrade(client, con, args, player, member, message, 'malachite', ['malachites'], 'iron', ['fer', 'fers', 'irons']);
  manageTrade(client, con, args, player, member, message, 'malachite', ['malachites'], 'gold', ['or', 'ors', 'golds']);
  manageTrade(client, con, args, player, member, message, 'malachite', ['malachites'], 'malachite', ['malachites']);
};

module.exports.help = {
  name: "trade",
  description_fr: "Pour échanger des objets",
  description_en: "To trade items",
  usage_fr: "<objet> <quantité> <@quelqu'un> <objet> <quantité>",
  usage_en: "<item> <quantity> <@someone> <item> <quantity>",
  category: "RPG",
  aliases: ["tr", "tra"]
};
