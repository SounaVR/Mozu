module.exports.run = async (client, message, args) => {
  if (!client.config.owners.includes(message.author.id)) return;

  var d = new Date();
  var curr_date = `0${d.getDate()}`.slice(-2)
  var curr_month = `0${d.getMonth() + 1}`.slice(-2)
  var curr_year = d.getFullYear()

  var curr_hour = `0${d.getHours()}`.slice(-2)
  var curr_min = `0${d.getMinutes()}`.slice(-2)
  var curr_sec = `0${d.getSeconds()}`.slice(-2)

    client.channels.cache.get("714076184262082580").send(`:red_circle: **[SYSTEM RESTART] Log du ${curr_date}/${curr_month}/${curr_year} | ${curr_hour}:${curr_min}:${curr_sec}\n> Redémarrage lancé par ${message.author.tag}.**`)
        message.channel.send("⚙️ Redémarrage en cours...").then(() => {
            process.exit();
      })
};

module.exports.help = {
  name: "reboot",
  description_fr: "Redémarre le bot",
  description_en: "Restart the bot",
  category: "Staff",
  aliases: ["reb", "_"]
};
