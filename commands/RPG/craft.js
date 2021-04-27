const Discord        = require('discord.js'),
    Default          = require('../../utils/default.json'),
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
        .addField("Documentation", `${lang.craft.doc} [ pickaxe ]\n[ sword / shield ]\n[ head / shoulders / bust / wrists\nhands / waist / legs / feet ]\n[ ring / dungeon_amulet / dungeon_stone ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    switch (args[0]) {
        case "p": case "pick": case "pickaxe":
            return manageCraft(con, player, message, "tools", "pickaxe");
        case "sw": case "sword":
            return manageCraft(con, player, message, "tools", "sword");
        case "sh": case "shield":
            return manageCraft(con, player, message, "tools", "shield");
        case "head":
            return manageCraft(con, player, message, "armors", "head");
        case "shoulders":
            return manageCraft(con, player, message, "armors", "shoulders");
        case "bust":
            return manageCraft(con, player, message, "armors", "bust");
        case "wrists":
            return manageCraft(con, player, message, "armors", "wrists");
        case "hands":
            return manageCraft(con, player, message, "armors", "hands");
        case "waist":
            return manageCraft(con, player, message, "armors", "waist");
        case "legs":
            return manageCraft(con, player, message, "armors", "legs");
        case "foots":
            return manageCraft(con, player, message, "armors", "feet");
        case "dungeon_amulet":
            return manageCraft(con, player, message, "objects", "dungeon_amulet");
        case "ring":
            return manageCraft(con, player, message, "objects", "ring");
        case "dungeon_stone":
            return manageCraft(con, player, message, "objects", "dungeon_stone");
        default:
            return message.channel.send(craftEmbed);
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
