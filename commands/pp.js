const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    let mention = message.mentions.users.first();

    let ppEmbed = new Discord.RichEmbed()
    //.setDescription("Avatar de " + mention)
    .setColor("#E6E6FA")
    //.setImage(mention.avatarURL);
    
    if (!message.mentions.users.size) {
        ppEmbed.setImage(message.author.displayAvatarURL)
        ppEmbed.setDescription("Votre avatar")
        message.channel.send(ppEmbed);
    } else if (mention) {
        ppEmbed.setImage(mention.avatarURL)
        ppEmbed.setDescription("Avatar de " + mention)
        message.channel.send(ppEmbed);
    }
}

module.exports.help = {
    name: "pp",
    aliases: []
}