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
        .addField("Documentation", `${lang.craft.doc} [ pickaxe ]\n[ sword / shield ]\n[ head / shoulders / chest / wrists\nhands / waist / legs / feet ]\n[ ring / dungeon_amulet / torch ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    switch (args[0]) {
        case "p": case "pick": case "pickaxe":
            return manageCraft(con, player, message, "tools", "pickaxe", Emotes.chests.Tools.rune_pickaxe);
        case "sw": case "sword":
            return manageCraft(con, player, message, "tools", "sword", Emotes.chests.Weapons.rune_sword);
        case "sh": case "shield":
            return manageCraft(con, player, message, "tools", "shield", Emotes.chests.Weapons.rune_shield);
        case "head":
            return manageCraft(con, player, message, "armors", "head", Emotes.chests.Gear.P1.rune_head);
        case "shoulders":
            return manageCraft(con, player, message, "armors", "shoulders", Emotes.chests.Gear.P1.rune_shoulders);
        case "chest":
            return manageCraft(con, player, message, "armors", "chest", Emotes.chests.Gear.P1.rune_chest);
        case "wrists":
            return manageCraft(con, player, message, "armors", "wrists", Emotes.chests.Gear.P1.rune_wrists);
        case "hands":
            return manageCraft(con, player, message, "armors", "hands", Emotes.chests.Gear.P2.rune_hands);
        case "waist":
            return manageCraft(con, player, message, "armors", "waist", Emotes.chests.Gear.P2.rune_waist);
        case "legs":
            return manageCraft(con, player, message, "armors", "legs", Emotes.chests.Gear.P2.rune_legs);
        case "feet":
            return manageCraft(con, player, message, "armors", "feet", Emotes.chests.Gear.P2.rune_feet);
        case "dungeon_amulet":
            return manageCraft(con, player, message, "objects", "dungeon_amulet", Emotes.dungeon_amulet);
        case "ring":
            return manageCraft(con, player, message, "objects", "ring", Emotes.ring);
        case "torch":
            return manageCraft(con, player, message, "objects", "torch", Emotes.torch);
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
