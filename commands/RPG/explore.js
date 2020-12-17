const Discord = require("discord.js");
const Default = require("../../utils/default.json");

module.exports.run = async (client, message, args, getPlayer) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;

    if (args[0] > 0) {
        if (player.data.dungeon_stone < args[0]) return message.channel.send(`❌ ${lang.explore.notEnoughDungeonStone} (${player.data.dungeon_stone}/${args[0]} ${Default.emotes.dungeon_stone})`);
        con.query(`UPDATE data SET chest_d = ${player.data.chest_d + Number(args[0])}, dungeon_stone = ${player.data.dungeon_stone - (args[0])} WHERE userid = ${userid}`)
              
        return message.channel.send(`${Default.emotes.torch} ${lang.explore.explored} ${lang.explore.zone} ${lang.explore.haveGot} **${args[0]}** ${lang.explore.chest}`)
    } else {
        return message.channel.send(`❌ ${lang.explore.correctUsage}`)
    }
};
  
module.exports.help = {
    name: "explore",
    description_fr: "Pour explorer des contrées inconnues",
    description_en: "To explore unknown lands",
    usage_fr: "<quantité>",
    usage_en: "<quantity>",
    category: "RPG",
    aliases: ['epl', 'pl']
};