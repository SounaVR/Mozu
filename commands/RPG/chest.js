const manageChest = require('../../functions/manageChest');
const Default     = require('../../utils/default.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    args[0] = "o" || "open";
    if (!args[0].toLowerCase()) return message.reply(`${lang.chest.correctUsage.replace("%s", client.config.prefix)}`);
    if (!args[2] || args[2] < 1) return message.reply(`${lang.chest.correctUsage.replace("%s", client.config.prefix)}`);
    if (!args[1].toLowerCase()) return message.reply(`${lang.chest.correctUsage.replace("%s", client.config.prefix)}`);

    switch (args[1].toLowerCase()) {
        case "d":
            manageChest(client, con, player, message, args, 'chest_d', `${lang.chest.rarity_d}`, 1, 75);
            break;
        case "c":
            manageChest(client, con, player, message, args, 'chest_c', `${lang.chest.rarity_c}`, 76, 200);
            break;
        case "b":
            manageChest(client, con, player, message, args, 'chest_b', `${lang.chest.rarity_b}`, 201, 600);
            break;
        case "a":
            manageChest(client, con, player, message, args, 'chest_a', `${lang.chest.rarity_a}`, 601, 900);
            break;
        case "s":
            manageChest(client, con, player, message, args, 'chest_s', `${lang.chest.rarity_s}`, 1000, 1500);
            break;

        default:
            message.reply(`${lang.chest.correctUsage.replace("%s", client.config.prefix)}`);
            break;
    }
};

exports.help = {
    name: "chest",
    description_fr: "Ouvrir des coffres pour obtenir des runes d'enchantements.",
    description_en: "Open chests to get enchantment runes.",
    usage_fr: "<open> <d/c/b/a/s> <quantité>",
    usage_en: "<open> <d/c/b/a/s> <quantity>",
    category: "RPG",
    aliases: ["ch"]
};

//75
//76-200
//201-600
//601-900
//1000-1500
