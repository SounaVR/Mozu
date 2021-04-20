const Discord        = require('discord.js'),
    Default          = require('../../utils/default.json'),
    manageEnchant    = require('../../functions/manageEnchant');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    const enchantEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("ENCHANT")
        .setThumbnail("https://media.discordapp.net/attachments/691992473999769623/796006868212383755/EnchantedDiamondSwordNew.gif")
        .addField("Description", `${lang.enchant.description}`)
        .addField("Documentation", `${lang.enchant.doc} [ pickaxe ]\n[ sword / shield ]\n[ head / shoulders / chest / wrist\nhands / waist / legs / feet ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    switch (args[0]) {
        case "p": case "pick": case "pickaxe":
            return manageEnchant(client, con, player, message, "tools", "pickaxe", "ench_pickaxe")
        case "sw": case "sword":
            return manageEnchant(client, con, player, message, "tools", "sword", "ench_sword");
        case "sh": case "shield":
            return manageEnchant(client, con, player, message, "tools", "shield", "ench_shield")
        case "head":
            return manageEnchant(client, con, player, message, "armors", "head", "ench_head")
        case "shoulders":
            return manageEnchant(client, con, player, message, "armors", "shoulders", "ench_shoulders")
        case "chest":
            return manageEnchant(client, con, player, message, "armors", "chest", "ench_chest")
        case "wrist":
            return manageEnchant(client, con, player, message, "armors", "wrists", "ench_wrists")
        case "hands":
            return manageEnchant(client, con, player, message, "armors", "hands", "ench_hands")
        case "waist":
            return manageEnchant(client, con, player, message, "armors", "waist", "ench_waist")
        case "legs":
            return manageEnchant(client, con, player, message, "armors", "legs", "ench_legs")
        case "feet":
            return manageEnchant(client, con, player, message, "armors", "feet", "ench_feet");
        default:
            return message.channel.send(enchantEmbed);
    }
};

exports.help = {
    name: "enchant",
    description_fr: "Pour enchanter votre équipement",
    description_en: "To enchant your equipment",
    usage_fr: "<item>",
    usage_en: "<objet>",
    category: "RPG",
    aliases: ["ench", "en", "enchantement", "enchantment"]
};
