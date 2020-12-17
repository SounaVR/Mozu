const Discord = require("discord.js");
const Default = require("../../utils/default.json");
const ms = require("parse-ms");

module.exports.run = async (client, message, args, getPlayer, getUser) => {
  var con = client.connection
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.");
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
  const user = getUserFromMention(args[0]);
  if (!args[0] || !user) return message.channel.send(`${lang.rep.correctUsage}`)

  if (user.id === userid) return message.reply(`${lang.rep.self}`)
  if (user.id === client.user.id) return message.reply(`${lang.rep.me}`)
  if (user.bot) return message.reply(`${lang.rep.other}`)
  var member = await getUser(con, user.id);

  if (!member) return message.reply("cet utilisateur n'est pas inscrit.");

  if (player.data.LastRep === 1) {
    return message.reply(`${lang.rep.notnow}`)
  } else if (player.data.LastRep === 0) {
    con.query(`UPDATE data SET LastRep = 1 WHERE userid = ${userid}`)
    con.query(`UPDATE data SET rep = ${member.data.LastRep + Number(1)} WHERE userid = ${user.id}`)
    return message.channel.send(`<@${userid}> - ${lang.rep.done} <@${user.id}>.`)
  }
}

module.exports.help = {
  name: 'rep',
  description_fr: 'Donne un point de réputation à un joueur',
  description_en: 'Gives a reputation point to a player',
  usage_fr: '@quelqu\'un',
  usage_en: '@someone',
  category: 'RPG'
}
