const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
  await message.delete()
  let botmessage = args.join(" ");
  let name = message.author.username;
  let avatar = message.author.displayAvatarURL
const hook = await message.channel.createWebhook(name, avatar).catch(error => console.log(error))
await hook.edit(name, avatar).catch(error => console.log(error))

hook.send(botmessage);
  hook.delete()
      
}

module.exports.help = {
  name: "wbh",
  aliases: []
}