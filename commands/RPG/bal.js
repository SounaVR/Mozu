const Default = require("../../utils/default.json");

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
  var con = client.connection;
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.");
  const lang = require(`../../utils/text/${player.data.lang}.json`);

  message.channel.send(`💳 ► ${lang.bal.actual1} **${nFormatter(player.data.money)}**${Default.emotes.cash} ${lang.bal.actual2}`);
};

module.exports.help = {
  name: "bal",
  description_fr: "Affiche votre solde",
  description_en: "Displays your balance",
  category: "RPG",
  aliases: ["balance"]
};
