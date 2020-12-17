const Discord = require('discord.js')
const Default = require('../../utils/default.json')

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

function manageSell(client, con, args, player, message, objectName, objectAliases) {
  var con = client.connection
  const price = require(`../../utils/items/price/${player.data.lang}.json`)
  const lang = require(`../../utils/text/${player.data.lang}.json`)
  const userid = message.author.id;

  if (args[0] && objectAliases.includes(args[0].toLowerCase()) || objectName.includes(args[0])) {
    args[1] = Math.floor(args[1])

    if (args[1] > 0) {
      message.channel.send(`${lang.sell.confirm} **${args[1]} ${lang.inventory[objectName]}**${Default.emotes[objectName]} ${lang.sell.confirm2} **${price.sell[objectName] * args[1]}**${Default.emotes.cash} ?`).then(async e => {
        await e.react("✅");
        await e.react("❌");

        const filter = (reaction, user) => {
          return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        e.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
        .then(async collected => {
          const reaction = collected.first();

        if (reaction.emoji.name === '✅') {
          if (player.data[objectName] < args[1]) {
            e.reactions.removeAll();
            return e.edit(`${lang.sell.failed}`)
          }
          con.query(`UPDATE data SET ${objectName} = ${player.data[objectName] - Number(args[1])}, money = ${player.data.money + (price.sell[objectName] * args[1])} WHERE userid = ${userid}`)
          e.edit(`${lang.sell.done} **${args[1]} ${lang.inventory[objectName]}**${Default.emotes[objectName]} ${lang.sell.done2} **${price.sell[objectName] * args[1]}**${Default.emotes.cash}`)
          } else if (reaction.emoji.name === '❌') {
            e.edit(`${lang.sell.cancel}`);
          }
          e.reactions.removeAll();
        }).catch(collected => {
          e.reactions.removeAll();
        })
      });
    } else {
      return message.channel.send(`${lang.sell.error}`)
    }
  }
}

module.exports.run = async (client, message, args, getPlayer) => {
  var con = client.connection
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.");
  const lang = require(`../../utils/text/${player.data.lang}.json`)
  const price = require(`../../utils/items/price/${player.data.lang}.json`)

  if (!args[0]) {
  const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor)
    .setTitle(`${lang.sell.title} (${nFormatter(player.data.money)}${Default.emotes.cash})`)
    .setDescription(`${lang.sell.desc}`)
    .setThumbnail("https://cdn.discordapp.com/attachments/691992473999769623/738056123361525780/shop-150362_960_720.png")
    .addField(`${Default.emotes.stone}${lang.inventory.stone}${Default.emotes.stone} (${nFormatter(player.data.stone)})`, `**4**${Default.emotes.cash}`, true)
    .addField(`${Default.emotes.coal}${lang.inventory.coal}${Default.emotes.coal} (${nFormatter(player.data.coal)})`, `**50**${Default.emotes.cash}`, true)
    .addField(`${Default.emotes.copper}${lang.inventory.copper}${Default.emotes.copper} (${nFormatter(player.data.copper)})`, `**37**${Default.emotes.cash}`, true)
    .addField(`${Default.emotes.iron}${lang.inventory.iron}${Default.emotes.iron} (${nFormatter(player.data.iron)})`, `**72**${Default.emotes.cash}`, true)
    .addField(`${Default.emotes.gold}${lang.inventory.gold}${Default.emotes.gold} (${nFormatter(player.data.gold)})`, `**145**${Default.emotes.cash}`, true)
    .addField(`${Default.emotes.malachite}${lang.inventory.malachite}${Default.emotes.malachite} (${nFormatter(player.data.malachite)})`, `**200**${Default.emotes.cash}`, true)
    .setFooter(`${lang.sell.footer}`);

    message.channel.send(embed);
  }
  if (args[0]) {
    if (!args[1]) return message.channel.send(`${lang.shop.correctU}`);
  }
  manageSell(client, con, args, player, message, 'stone', ['caillou', 'cailloux', 'stones']);
  manageSell(client, con, args, player, message, 'coal', ['charbon']);
  manageSell(client, con, args, player, message, 'copper', ['cuivre', 'cuivres', 'coppers']);
  manageSell(client, con, args, player, message, 'iron', ['fer', 'fers', 'irons']);
  manageSell(client, con, args, player, message, 'gold', ['or', 'ors', 'golds']);
  manageSell(client, con, args, player, message, 'malachite', ['malachites']);
};

module.exports.help = {
    name: "sell",
    description_fr: "Pour vendre des items",
    description_en: "To sell items",
    usage_fr: "<Nom de L'objet> <Nombre>",
    usage_en: "<Item Name> <Number>",
    category: "RPG",
    aliases: ["s"]
};
