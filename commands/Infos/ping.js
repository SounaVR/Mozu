/**
 * @author ReallySouna
 * @file ping.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {

    const m = await message.channel.send("Ping?");
    m.edit(`Pong! La latence est de ${Math.round(bot.ws.ping)}ms`);
};

// Help Object
module.exports.help = {
    name: "ping",
    description: "Affiche la latence du bot",
    usage: "",
    category: "Infos",
    aliases: ["pong"]
};
