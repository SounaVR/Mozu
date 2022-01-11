const Discord        = require('discord.js'),
    Default          = require('../../utils/default.json'),
    Emotes           = require('../../utils/emotes.json'),
    manageCraft      = require('../../functions/manageCraft');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    const craftEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.description}`)
        .addField("Documentation", `${lang.craft.doc} ${Emotes.tools} [ pickaxe ]\n${Emotes.bag} [ ring ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    switch (args[0]) {
        case "p": case "pick": case "pickaxe":
            return manageCraft(con, player, args, message, "tools", "pickaxe", Emotes.chests.Tools.rune_pickaxe);
        case "ring":
            return manageCraft(con, player, args, message, "objects", "ring", Emotes.ring);
        default:
            return message.channel.send({ embeds: [craftEmbed] });
    }
};

exports.help = {
    name: "craft",
    description_fr: "Pour fabriquer ou améliorer votre équipement actuel.",
    description_en: "To craft or upgrade your current equipment.",
    usage_fr: "<équipement>",
    usage_en: "<equipment>",
    category: "RPG",
    aliases: ["cra"]
};
