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

module.exports.run = async (client, message, args, getPlayer) => {
  var con = client.connection
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
  const lang = require(`../../utils/text/${player.data.lang}.json`);

  if (!args[0]) return message.channel.send(`${lang.top.correctU}`);

  if (args[0] && ["money", "pp", "argent"].includes(args[0].toLowerCase())) {
  const top10query = `SELECT username, money FROM data ORDER BY cast(money as SIGNED) DESC LIMIT 10`

  const query = querytxt => {
    return new Promise((resolve, reject) => {
      con.query(querytxt, (err, results, fields) => {
        if (err) reject(err);
        resolve([results, fields]);
      });
    });
  };
  const [results, fields] = await query(top10query);

  const map1 = results.map((results, position) => `#${position + 1} **${results.username}** : ${nFormatter(results.money)}💰`)

  return message.channel.send("🏆 __**Classement des Pièces de Phénix**__ 🏆\n\n" + map1.join("\n"));
  } else if (args[0] && ["xp"].includes(args[0].toLowerCase())) {
  const top10query = `SELECT username, XP FROM data ORDER BY cast(XP as SIGNED) DESC LIMIT 10`

  const query = querytxt => {
    return new Promise((resolve, reject) => {
      con.query(querytxt, (err, results, fields) => {
        if (err) reject(err);
        resolve([results, fields]);
      });
    });
  };
  const [results, fields] = await query(top10query);
  var first = ["🥇"]
  var second = ["🥈"]
  var third = ["🥉"]

  const map1 = results.map((results, position) => `#${position + 1} **${results.username}** : ${results.XP} points`)

  return message.channel.send("🏆 __**Classement des Points d'Expérience**__ 🏆\n\n" + map1.join("\n"));
  }
};

module.exports.help = {
  name: "top",
  description_fr: "Affiche différents classements",
  description_en: "Displays different rankings",
  usage_fr: "<XP/money>",
  usage_en: "<XP/money>",
  category: "RPG"
};
