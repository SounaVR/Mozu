const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("désolé, vous n'avez pas les permissions requises.");
  if(!args[0]) return message.reply("usage : r!clear [1-100].");
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`${args[0]} messages supprimés.`).then(msg => msg.delete(5000));
  });
}

module.exports.help = {
  name: "clear",
    aliases: []
}
