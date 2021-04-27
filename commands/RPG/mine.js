const Discord = require('discord.js'),
    Emotes    = require('../../utils/emotes.json'),
    Default   = require('../../utils/default.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const Items = require(`../../utils/items/${player.data.lang}.json`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;

    // all/a | [numbers] | aucun argument = 1 énergie par commande
    let manaAmount = 'all'.startsWith(args[0]) ? player.ress.energy : (!isNaN(args[0]) && args[0] > 0 ? args[0] : 1)
    if (manaAmount > player.ress.energy) return message.channel.send(`${lang.mine.notEnoughEnergy}`)

    let Stone  = 0,
    Coal      = 0,
    Copper    = 0,
    Iron      = 0,
    Gold      = 0,
    Malachite = 0;
    // Drop de ressources
    for (let i = 0; i < manaAmount; i++) {
        Stone     += Math.ceil(Math.random() * 70)                                // Pioche level 0 (mains nues)
        Coal      += Math.ceil(Math.random() * 50)                                // Pioche level 0 (mains nues)
        Copper    += player.items.pickaxe > 0 ? Math.ceil(Math.random() * 45) : 0 // Pioche level 1 (pioche en pierre)
        Iron      += player.items.pickaxe > 1 ? Math.ceil(Math.random() * 30) : 0 // Pioche level 2 (pioche en cuivre)
        Gold      += player.items.pickaxe > 2 ? Math.ceil(Math.random() * 15) : 0 // Pioche level 3 (pioche en fer)
        Malachite += player.items.pickaxe > 3 ? Math.ceil(Math.random() * 5) : 0  // Pioche level 4 (pioche en or)
    }

    let ressLoot = []
    if (Stone)      ressLoot.push(`+ ${Stone} ${Emotes.stone}`)
    if (Coal)       ressLoot.push(`+ ${Coal} ${Emotes.coal}`)
    if (Copper)     ressLoot.push(`+ ${Copper} ${Emotes.copper}`)
    if (Iron)       ressLoot.push(`+ ${Iron} ${Emotes.iron}`)
    if (Gold)       ressLoot.push(`+ ${Gold} ${Emotes.gold}`)
    if (Malachite)  ressLoot.push(`+ ${Malachite} ${Emotes.malachite}`)

    let pickaxe = Items.tools.pickaxe[player.items.pickaxe];

    const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setThumbnail("https://equity.guru/wp-content/uploads/2018/01/blockchain2.gif")
        .addField(lang.mine.title, ressLoot.join("\n"))
        .addField(lang.mine.infos, `⚡ ${lang.mine.usedEnergy} : ${manaAmount}\n⚡ ${lang.mine.remainingEnergy} : ${player.ress.energy-manaAmount}\n${Emotes.chests.Tools.rune_pickaxe} ${pickaxe.name}\n💪 ${lang.mine.power} ${player.data.power}`);//\n${lang.inventory.level}: ${player.items.pickaxe}\n${lang.inventory.enchant}: ${player.enchant.ench_pickaxe}`)

    message.channel.send(embed);

    con.query(`UPDATE ress SET energy = energy - ${manaAmount}, stone = stone + ${Stone}, coal = coal + ${Coal}, copper = copper + ${Copper}, iron = iron + ${Iron}, gold = gold + ${Gold}, malachite = malachite + ${Malachite} WHERE userid = ${userid}`);
};

exports.help = {
    name: "mine",
    description_fr: "Pour miner des ressources",
    description_en: "For resource mining",
    usage_fr: "(nombre d'énergie) ou (all)",
    usage_en: "(number of energy) or (all)",
    category: "RPG",
    aliases: ["m", "mi"]
};
