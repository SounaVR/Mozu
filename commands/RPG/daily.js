const Default = require("../../utils/default.json");
const ms = require("parse-ms");

module.exports.run = async (client, message, args, getPlayer) => {
  var con = client.connection;
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
  const lang = require(`../../utils/text/${player.data.lang}.json`);
  let userid = message.author.id;

  if (player.data.daily === 1) {
    return message.reply(`${lang.daily.notnow}`)
  } else if (player.data.daily === 0) {
    con.query(`UPDATE data SET LastDaily = ${player.data.LastDaily + Number(1)}, daily = 1, money = ${player.data.money + Number(300)} WHERE userid = ${userid}`)
    return message.reply(`${lang.daily.done}`)
  }
};

module.exports.help = {
    name: "daily",
    description_fr: "Collecte de l'argent tout les jours à 00h00",
    description_en: "Collecting money every day at 00h00 (Paris time zone)",
    category: "RPG",
    aliases: ["dai", "dl"]
};
