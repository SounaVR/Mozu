const Discord = require("discord.js");
const Default = require("../../utils/default.json");

function nFormatter(num) {
    const format = [
        { value: 1e18, symbol: 'E' },
        { value: 1e15, symbol: 'P' },
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'G' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'k' },
        { value: 1, symbol: '' },
    ];
    const formatIndex = format.findIndex((data) => num >= data.value);
    return (num / format[formatIndex === -1? 6: formatIndex].value).toFixed() + format[formatIndex === -1?6: formatIndex].symbol;
  }

module.exports.run = async (client, message, args, getPlayer) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.")
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;

    var gainedPickaxe = Math.ceil(Math.random() * 75)
    var gainedTete = Math.ceil(Math.random() * 75)
    var gainedEpaules = Math.ceil(Math.random() * 75)
    var gainedTorse = Math.ceil(Math.random() * 75)
    var gainedPoignets = Math.ceil(Math.random() * 75)
    var gainedMains = Math.ceil(Math.random() * 75)
    var gainedTaille = Math.ceil(Math.random() * 75)
    var gainedJambes = Math.ceil(Math.random() * 75)
    var gainedPieds = Math.ceil(Math.random() * 75)
    const ChestEmbed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor)

    if (args[0] === "open" || args[0] === "o") {
        if (args[1] > 0) {
            if (player.data.chest_d < args[1]) return message.channel.send(`❌ ${lang.chest.notEnoughChests}`)
            if (player.data.classe === "Guerrier") {
                var gainedSword = Math.ceil(Math.random() * 75)
                var gainedShield = Math.ceil(Math.random() * 75)
                ChestEmbed.setTitle(`${Default.emotes.chest} ${lang.chest.opening} ${args[1]} ${lang.chest.chest} (${lang.chest.rarity})`)
                ChestEmbed.addField(`Gain`, `
                ${Default.emotes.rune_sword} : ${nFormatter(gainedSword * args[1])}
                ${Default.emotes.rune_shield} : ${nFormatter(gainedShield * args[1])}
                ${Default.emotes.rune_pickaxe} : ${nFormatter(gainedPickaxe * args[1])}
                ${Default.emotes.rune_tete} : ${nFormatter(gainedTete * args[1])}
                ${Default.emotes.rune_epaule} : ${nFormatter(gainedEpaules * args[1])} 
                ${Default.emotes.rune_torse} : ${nFormatter(gainedTorse * args[1])} 
                ${Default.emotes.rune_poignets} : ${nFormatter(gainedPoignets * args[1])} 
                ${Default.emotes.rune_mains} : ${nFormatter(gainedMains * args[1])} 
                ${Default.emotes.rune_taille} : ${nFormatter(gainedTaille * args[1])} 
                ${Default.emotes.rune_jambes} : ${nFormatter(gainedJambes * args[1])} 
                ${Default.emotes.rune_pieds} : ${nFormatter(gainedPieds * args[1])}`)
                con.query(`UPDATE data SET rune_sword = ${(player.data.rune_sword + Number(gainedSword)) * args[1]}, rune_shield = ${(player.data.rune_shield + Number(gainedShield)) * args[1]} WHERE userid = ${userid}`)
            } else if (player.data.classe === "Mage") {
                var gainedWand = Math.ceil(Math.random() * 75)
                ChestEmbed.setTitle(`${Default.emotes.chest} ${lang.chest.opening} ${args[1]} ${lang.chest.chest} (${lang.chest.rarity})`)
                ChestEmbed.addField(`Gain`, `
                ${Default.emotes.rune_wand} : ${nFormatter(gainedWand * args[1])} 
                ${Default.emotes.rune_pickaxe} : ${nFormatter(gainedPickaxe * args[1])} 
                ${Default.emotes.rune_tete} : ${nFormatter(gainedTete * args[1])} 
                ${Default.emotes.rune_epaule} : ${nFormatter(gainedEpaules * args[1])} 
                ${Default.emotes.rune_torse} : ${nFormatter(gainedTorse * args[1])} 
                ${Default.emotes.rune_poignets} : ${nFormatter(gainedPoignets * args[1])} 
                ${Default.emotes.rune_mains} : ${nFormatter(gainedMains * args[1])} 
                ${Default.emotes.rune_taille} : ${nFormatter(gainedTaille * args[1])} 
                ${Default.emotes.rune_jambes} : ${nFormatter(gainedJambes * args[1])} 
                ${Default.emotes.rune_pieds} : ${nFormatter(gainedPieds * args[1])}`)
                con.query(`UPDATE data SET rune_wand = ${(player.data.rune_wand + Number(gainedWand)) * args[1]} WHERE userid = ${userid}`)
            } else if (player.data.classe === "Chasseur") {
                var gainedBow = Math.ceil(Math.random() * 75)
                ChestEmbed.setTitle(`${Default.emotes.chest} ${lang.chest.opening} ${args[1]} ${lang.chest.chest} (${lang.chest.rarity})`)
                ChestEmbed.addField(`Gain`, `
                ${Default.emotes.rune_bow} : ${nFormatter(gainedBow * args[1])} 
                ${Default.emotes.rune_pickaxe} : ${nFormatter(gainedPickaxe * args[1])} 
                ${Default.emotes.rune_tete} : ${nFormatter(gainedTete * args[1])} 
                ${Default.emotes.rune_epaule} : ${nFormatter(gainedEpaules * args[1])} 
                ${Default.emotes.rune_torse} : ${nFormatter(gainedTorse * args[1])} 
                ${Default.emotes.rune_poignets} : ${nFormatter(gainedPoignets * args[1])} 
                ${Default.emotes.rune_mains} : ${nFormatter(gainedMains * args[1])} 
                ${Default.emotes.rune_taille} : ${nFormatter(gainedTaille * args[1])} 
                ${Default.emotes.rune_jambes} : ${nFormatter(gainedJambes * args[1])} 
                ${Default.emotes.rune_pieds} : ${nFormatter(gainedPieds * args[1])}`)
                con.query(`UPDATE data SET rune_bow = ${(player.data.rune_bow + Number(gainedBow)) * args[1]} WHERE userid = ${userid}`)
            }
            con.query(`UPDATE data SET chest_d = ${player.data.chest_d - args[1]}, rune_pickaxe = ${(player.data.rune_pickaxe + Number(gainedPickaxe)) * args[1]},
            rune_tete = ${(player.data.rune_tete + Number(gainedTete)) * args[1]}, rune_epaule = ${(player.data.rune_epaule + Number(gainedEpaules)) * args[1]},
            rune_torse = ${(player.data.rune_torse + Number(gainedTorse)) * args[1]}, rune_poignets = ${(player.data.rune_poignets + Number(gainedPoignets)) * args[1]},
            rune_mains = ${(player.data.rune_mains + Number(gainedMains)) * args[1]}, rune_taille = ${(player.data.rune_taille + Number(gainedTaille)) * args[1]},
            rune_jambes = ${(player.data.rune_jambes + Number(gainedJambes)) * args[1]}, rune_pieds = ${(player.data.rune_pieds + Number(gainedPieds)) * args[1]} WHERE userid = ${userid}`)
            return message.channel.send(ChestEmbed);
        } else {
            return message.channel.send(`❌ ${lang.chest.correctUsage}`)
        }
    } else {
        return message.channel.send(`❌ ${lang.chest.correctUsage}`)
    }
};
  
module.exports.help = {
    name: "chest",
    description_fr: "Pour explorer des contrées inconnues",
    description_en: "To explore unknown lands",
    usage_fr: "open <quantité>",
    usage_en: "open <quantity>",
    category: "RPG",
    aliases: ['ch']
};

// D = 1-75
// C = 76-200
// B = 201-400
// A = 401-800
// S = 801-1000