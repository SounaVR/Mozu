const Default = require("../../utils/default.json");
const ms = require("parse-ms");

module.exports.run = async (client, message, args, getPlayer) => {
  var con = client.connection
  var player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
  const lang = require(`../../utils/text/${player.data.lang}.json`);
  let userid = message.author.id;
  let cooldown = 3600000;

  if (player.data.LastHR !== null && cooldown - (Date.now() - player.data.LastHR) > 0) {
  let timeObj = ms(cooldown - (Date.now() -  player.data.LastHR));

  message.channel.send(`${lang.hr.notnow} **${timeObj.minutes}m${timeObj.seconds}sec** !`);
  } else {
    var player = await getPlayer(con, userid);

  message.channel.send(`${message.author.username}, ${lang.hr.done}`);

  con.query(`UPDATE data SET LastHR = ?, money = ? WHERE userid = ?`, [Date.now(), player.data.money + 30, userid]);
  }
};

module.exports.help = {
    name: "hourly",
    description_fr: "Collecte de l'argent toutes les heures",
    description_en: "Collecting money every hour",
    category: "RPG",
    aliases: ["hr"]
};
