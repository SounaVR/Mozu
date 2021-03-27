const Default = require('../../utils/default.json');

module.exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const user = message.mentions.users.first() || message.author;
    const userid = message.author.id;

    if (!args[0] && player.data.lastRep === 1) return message.reply(`${lang.rep.notNow}`);
    if (!args[0] && player.data.lastRep === 0) return message.reply(`${lang.rep.now}`)

    if (user.id === userid) return message.reply(`${lang.rep.giveToSelf}`)
    if (user.id === client.user.id) return message.reply(`${lang.rep.giveToMozu}`)
    if (user.bot) return message.reply(`${lang.rep.giveToOtherBots}`)
    const member = await getUser(con, user.id);

    if (!member) return message.channel.send(`${lang.rep.unknownUser}`);
    if (player.data.lastRep === 1) {
        return message.reply(`${lang.rep.notNow}`)
    } else if (player.data.lastRep === 0) {
        con.query(`UPDATE data SET lastRep = 1, rep = ${member.data.lastRep + Number(1)} WHERE userid = ${userid}`)
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
