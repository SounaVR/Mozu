const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js'),
    Default          = require('../../utils/default.json'),
    Emotes           = require('../../utils/emotes.json');

async function manageEnchant(client, con, player, message, category, object, objectName) {
    const Enchant = require(`../../utils/items/enchant.json`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const react = ['780222056007991347', '780222833808506920'];

    const level = Math.floor(player.enchant[objectName])+1;

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    //const objectRessource = Enchant[category][object][1];
    const getNeededRessource = (player.enchant[objectName] * player.enchant[objectName] * 5)+1;

    embed.setTitle(`Enchant your item ?`)
    let txt = [];

    if (player.ress[`rune_${object}`] < getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(getNeededRessource-player.ress[`rune_${object}`]))})`);
    if (player.ress[`rune_${object}`] >= getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.checked})`);

    embed.addField("**Cost**", txt);

    const msg = await message.channel.send(embed);

    await msg.react(react[0]);
    await msg.react(react[1]);

    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
        let reaction = collected.first();

        switch(reaction.emoji.id) {
            case react[0]:
                msg.delete();
                let need = [];
                let resssql = [];

                if (player.ress[`rune_${object}`] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`rune_${object} = rune_${object} - ${getNeededRessource}`);

                if (need.length >= 1) return message.channel.send(`${lang.enchant.notEnoughRess}`);

                con.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE data SET ATK = ${player.data.ATK + Number(Enchant[category][object][0].ATK)}, DEF = ${player.data.DEF + Number(Enchant[category][object][0].DEF)} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE enchant SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);

                return message.channel.send(`${lang.enchant.enchantSuccess} : **${level}** !`);

            case react[1]:
                msg.delete();
                return message.channel.send(`${lang.enchant.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}

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
