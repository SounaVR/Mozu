/**
 * @author ReallySouna
 * @file reboot.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
  if (!bot.config.owners.includes(message.author.id)) return;

    bot.channels.cache.get("698861927652261988").send(":red_circle: **Bot éteint par commande admin**")
        message.delete().then(() => {
            process.exit(1);
      })
};

// Help Object
module.exports.help = {
  name: "reboot",
  description: "Redémarre le bot",
  usage: "",
  category: "Dev",
  aliases: ["reb"]
};
