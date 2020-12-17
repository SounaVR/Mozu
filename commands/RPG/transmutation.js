const Discord = require('discord.js');
const Default = require('../../utils/default.json');

function nFormatter(num) {
  const format = [
      { value: 1e18, symbol: 'E' },
      { value: 1e15, symbol: 'P' },
      { value: 1e12, symbol: 'T' },
      { value: 1e9, symbol: 'G' },
      { value: 1e6, symbol: 'M' },
      { value: 1e3, symbol: 'k' },
      { value: 1, symbol: '' },
  ];
  const formatIndex = format.findIndex((data) => num >= data.value);
  return (num / format[formatIndex === -1? 6: formatIndex].value).toFixed() + format[formatIndex === -1?6: formatIndex].symbol;
}

module.exports.run = async (bot, message, args, getPlayer) => {
  var con = bot.connection
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
  const lang = require(`../../utils/text/${player.data.lang}.json`);
  const userid = message.author.id;

  if (player.data.classe !== "Mage") return message.channel.send(lang.craft.errorClass + " `Mage` !");

  if (args[0] && ["stone", "caillou", "cailloux", "stones"].includes(args[0].toLowerCase())) { // Regarde le premier argument pour savoir ce que le mec il veut faire comme action
    args[1] = Math.floor(args[1])
    if (args[1] > 0) {
      message.channel.send(`${lang.mumu.confirm} **${nFormatter(args[1] * 4)} ${lang.inventory.stone}**${Default.emotes.stone} vs **${nFormatter(args[1])} ${lang.inventory.copper} **${Default.emotes.copper} ?`).then(async e => { // et la on envoie le message
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
          if (player.data.stone < (args[1] * 4)) {
            e.reactions.removeAll();
            return e.edit(`${lang.mumu.failed} ${nFormatter(Math.abs((args[1] * 4) - player.data.stone))}${Default.emotes.stone}`)
          }
          con.query(`UPDATE data SET stone = ${player.data.stone - Number(args[1] * 4)}, copper = ${player.data.copper + Number(args[1])} WHERE userid = ${userid}`)
          e.edit(`${lang.mumu.done} **${nFormatter(args[1])} ${lang.inventory.copper}**${Default.emotes.copper} ${lang.shop.done2} **${nFormatter(args[1] * 4)} ${lang.inventory.stone}**${Default.emotes.stone}`)
          } else if (reaction.emoji.name === '❌') {
            e.edit(`${lang.mumu.cancel}`);
          }
          e.reactions.removeAll();
        }).catch(collected => {
          e.reactions.removeAll();
        })
      });
    } else {
      return message.channel.send(`${lang.mumu.error}`)
    }
  } else if (args[0] && ["copper", "cuivre", "cuivres", "coppers"].includes(args[0].toLowerCase())) { // Regarde le premier argument pour savoir ce que le mec il veut faire comme action
    args[1] = Math.floor(args[1])
    if (args[1] > 0) {
      message.channel.send(`${lang.mumu.confirm} **${nFormatter(args[1] * 4)} ${lang.inventory.copper}**${Default.emotes.copper} vs **${nFormatter(args[1])} ${lang.inventory.iron} **${Default.emotes.iron} ?`).then(async e => { // et la on envoie le message
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
          if (player.data.copper < (args[1] * 4)) {
            e.reactions.removeAll();
            return e.edit(`${lang.mumu.failed} ${nFormatter(Math.abs((args[1] * 4) - player.data.copper))}${Default.emotes.copper}`)
          }
          con.query(`UPDATE data SET copper = ${player.data.copper - Number(args[1] * 4)}, iron = ${player.data.iron + Number(args[1])} WHERE userid = ${userid}`)
          e.edit(`${lang.mumu.done} **${nFormatter(args[1])} ${lang.inventory.iron}**${Default.emotes.iron} ${lang.shop.done2} **${nFormatter(args[1] * 4)} ${lang.inventory.copper}**${Default.emotes.copper}`)
          } else if (reaction.emoji.name === '❌') {
            e.edit(`${lang.mumu.cancel}`);
          }
          e.reactions.removeAll();
        }).catch(collected => {
          e.reactions.removeAll();
        })
      });
    } else {
      return message.channel.send(`${lang.mumu.error}`)
    }
  } else if (args[0] && ["iron", "fer", "fers", "irons"].includes(args[0].toLowerCase())) { // Regarde le premier argument pour savoir ce que le mec il veut faire comme action
    args[1] = Math.floor(args[1])
    if (args[1] > 0) {
      message.channel.send(`${lang.mumu.confirm} **${nFormatter(args[1] * 4)} ${lang.inventory.iron}**${Default.emotes.iron} vs **${nFormatter(args[1])} ${lang.inventory.gold} **${Default.emotes.gold} ?`).then(async e => { // et la on envoie le message
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
          if (player.data.iron < (args[1] * 4)) {
            e.reactions.removeAll();
            return e.edit(`${lang.mumu.failed} ${nFormatter(Math.abs((args[1] * 4) - player.data.iron))}${Default.emotes.iron}`)
          }
          con.query(`UPDATE data SET iron = ${player.data.iron - Number(args[1] * 4)}, gold = ${player.data.gold + Number(args[1])} WHERE userid = ${userid}`)
          e.edit(`${lang.mumu.done} **${nFormatter(args[1])} ${lang.inventory.gold}**${Default.emotes.gold} ${lang.shop.done2} **${nFormatter(args[1] * 4)} ${lang.inventory.iron}**${Default.emotes.iron}`)
          } else if (reaction.emoji.name === '❌') {
            e.edit(`${lang.mumu.cancel}`);
          }
          e.reactions.removeAll();
        }).catch(collected => {
          e.reactions.removeAll();
        })
      });
    } else {
      return message.channel.send(`${lang.mumu.error}`)
    }
  } else if (args[0] && ["golds", "gold", "or", "ors"].includes(args[0].toLowerCase())) { // Regarde le premier argument pour savoir ce que le mec il veut faire comme action
    args[1] = Math.floor(args[1])
    if (args[1] > 0) {
      message.channel.send(`${lang.mumu.confirm} **${nFormatter(args[1] * 4)} ${lang.inventory.gold}**${Default.emotes.gold} vs **${nFormatter(args[1])} ${lang.inventory.malachite} **${Default.emotes.malachite} ?`).then(async e => { // et la on envoie le message
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
          if (player.data.gold < (args[1] * 4)) {
            e.reactions.removeAll();
            return e.edit(`${lang.mumu.failed} ${nFormatter(Math.abs((args[1] * 4) - player.data.gold))}${Default.emotes.gold}`)
          }
          con.query(`UPDATE data SET gold = ${player.data.gold - Number(args[1] * 4)}, malachite = ${player.data.malachite + Number(args[1])} WHERE userid = ${userid}`)
          e.edit(`${lang.mumu.done} **${nFormatter(args[1])} ${lang.inventory.malachite}**${Default.emotes.malachite} ${lang.shop.done2} **${nFormatter(args[1] * 4)} ${lang.inventory.gold}**${Default.emotes.gold}`)
          } else if (reaction.emoji.name === '❌') {
            e.edit(`${lang.mumu.cancel}`);
          }
          e.reactions.removeAll();
        }).catch(collected => {
          e.reactions.removeAll();
        })
      });
    } else {
      return message.channel.send(`${lang.mumu.error}`)
    }
  } else {
    return message.channel.send(`${lang.mumu.correctU}`)
  }
};

module.exports.help = {
  name: "transmutation",
  description_fr: "Pour transmuter des minerais (Mage uniquement)",
  description_en: "To transmute ores (Mage only)",
  usage_fr: "<minerai> <quantité>",
  usage_en: "<ore> <quantity>",
  category: "RPG",
  aliases: ["transmu", "mumu", "t"]
};
