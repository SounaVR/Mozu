const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
if (message.author.id !== '436310611748454401') return;
message.delete();
const channel = message.member.voiceChannel;

    channel.join();
}
  
module.exports.help = {
  name: "join",
  aliases: []
}