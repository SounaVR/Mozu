const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js'),
      Default        = require('../../utils/default.json'),
      Emotes         = require('../../utils/emotes.json');

async function manageEnchant(client, con, player, message, category, object, objectName) {
    const Enchant = require(`../../utils/items/enchant.json`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const react = ['780222056007991347', '780222833808506920'];

    const level = Math.floor(player.data[objectName])+1;

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    //const objectRessource = Enchant[category][object][1];
    const getNeededRessource = player.data[objectName] * player.data[objectName] * 5;

    embed.setTitle(`Enchant your item ?`)
    let txt = [];

    if (player.data[`rune_${object}`] < getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(getNeededRessource-player.data[`rune_${object}`]))})`);
    if (player.data[`rune_${object}`] >= getNeededRessource) txt.push(`${Emotes.enchant[`rune_${object}`]} rune_${object} : ${nFormatter(getNeededRessource)} (${Emotes.checked})`);

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

                if (player.data[`rune_${object}`] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`rune_${object} = rune_${object} - ${getNeededRessource}`);

                if (need.length >= 1) return message.channel.send(`${lang.enchant.notEnoughRess}`);

                con.query(`UPDATE data SET ${resssql.join(',')}, ATK = ${player.data.ATK + Number(Enchant[category][object][0].ATK)}, DEF = ${player.data.DEF + Number(Enchant[category][object][0].DEF)}, ${objectName} = ${level} WHERE userid = ${message.author.id}`);

                return message.channel.send(`${lang.enchant.enchantSuccess} : **${level}** !`);

            case react[1]:
                msg.delete();
                return message.channel.send(`${lang.enchant.canceled}`);
        }
    }).catch(err => {
        msg.reactions.removeAll();
        if (err) console.warn(err);
    });
}

exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    const con = client.connection
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    var playerClasse;

    switch (player.data.classe) {
        case "Guerrier":
            playerClasse = `${Emotes.chests.Guerrier.rune_sword} = ${lang.inventory.sword} ]\n- [ ${Emotes.chests.Guerrier.rune_shield} = ${lang.inventory.shield} ]`;
            break;
        case "Mage":
            playerClasse = `${Emotes.chests.Mage.rune_wand} = ${lang.inventory.wand} ]`;
            break;
        case "Chasseur":
            playerClasse = `${Emotes.chests.Chasseur.rune_bow} = ${lang.inventory.bow} ]`;
            break;
    }

    var txt = [];
    for (const runes in Default.runes.Gear.P1) {
        txt.push(`- [ ${Emotes.chests.Gear.P1[runes]} = ${lang.inventory.Gear.P1[runes]} ]`)
    }
    for (const runes in Default.runes.Gear.P2) {
        txt.push(`- [ ${Emotes.chests.Gear.P2[runes]} = ${lang.inventory.Gear.P2[runes]} ]`)
    }

    const enchantEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("ENCHANT")
        .setThumbnail("https://media.discordapp.net/attachments/691992473999769623/796006868212383755/EnchantedDiamondSwordNew.gif")
        .addField("Description", `${lang.enchant.description}`)
        .addField("Documentation", `${lang.enchant.doc} :\n\n- [ ${Emotes.chests.Tools.rune_pickaxe} = ${lang.inventory.pickaxe} ]\n\n- [ ${playerClasse}\n\n${txt.join("\n")}`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    const msg = await message.channel.send(enchantEmbed);

    let react = [
        "748973331642056764", //pickaxe
        "771095091216515123", //sword
        "771113421202391051", //shield
        "748960787946537030", //wand
        "771331757399212053", //bow
        "748959964663382106", //tete
        "748959724170379324", //epaule
        "748960199389479053", //torse
        "748960470479798324", //poignets
        "748960653930135613", //mains
        "748961288960606300", //taille
        "748961288968994888", //jambes
        "748961289145155684"  //pieds
    ];
    await msg.react(react[0]);
    switch(player.data.classe) {
        case "Guerrier":
            await msg.react(react[1]);
            await msg.react(react[2]);
            break;
        case "Mage":
            await msg.react(react[3]);
            break;
        case "Chasseur":
            await msg.react(react[4]);
            break;
    }
    await msg.react(react[5]);
    await msg.react(react[6]);
    await msg.react(react[7]);
    await msg.react(react[8]);
    await msg.react(react[9]);
    await msg.react(react[10]);
    await msg.react(react[11]);
    await msg.react(react[12]);

    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
        let reaction = collected.first();

        msg.delete();
        switch(reaction.emoji.id) {
            case react[0]: //pickaxe
                manageEnchant(client, con, player, message, "tools", "pickaxe", "ench_pickaxe")
                break;
            case react[1]: //sword
                manageEnchant(client, con, player, message, "tools", "sword", "ench_sword");
                break;
            case react[2]: //shield
                manageEnchant(client, con, player, message, "tools", "shield", "ench_shield")
                break;
            case react[3]: //wand
                manageEnchant(client, con, player, message, "tools", "wand", "ench_wand")
                break;
            case react[4]: //bow
                manageEnchant(client, con, player, message, "tools", "bow", "ench_bow")
                break;
            case react[5]: //tete
                manageEnchant(client, con, player, message, "armors", "tete", "ench_tete")
                break;
            case react[6]: //epaule
                manageEnchant(client, con, player, message, "armors", "epaule", "ench_epaule")
                break;
            case react[7]: //torse
                manageEnchant(client, con, player, message, "armors", "torse", "ench_torse")
                break;
            case react[8]: //poignets
                manageEnchant(client, con, player, message, "armors", "poignets", "ench_poignets")
                break;
            case react[9]: //mains
                manageEnchant(client, con, player, message, "armors", "mains", "ench_mains")
                break;
            case react[10]: //taille
                manageEnchant(client, con, player, message, "armors", "taille", "ench_taille")
                break;
            case react[11]: //jambes
                manageEnchant(client, con, player, message, "armors", "jambes", "ench_jambes")
                break;
            case react[12]: //pieds
                manageEnchant(client, con, player, message, "armors", "pieds", "ench_pieds");
                break;
        }
    }).catch(err => {
        msg.reactions.removeAll();
        if (err) console.warn(err);
    });
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
