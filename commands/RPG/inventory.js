require("moment-duration-format");
const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js'),
    moment           = require('moment'),
    Pagination       = require('discord-paginationembed'),
    Default          = require('../../utils/default.json'),
    Emotes           = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const Items = require(`../../utils/items/${player.data.lang}.json`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const maxEnergy = Items.objects.ring[player.items.ring].energy;
    const cooldown = player.data.energyCooldown;
    
    const embed1 = new Discord.MessageEmbed()
        .setFooter(`Page 1/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`⭐ Mana`, `${player.data.MANA}/50`, true)
        .addField(`❤️ HP`, `${player.data.HP}/50`, true)
        .addField(`⚡ ${lang.inventory.energy.replace("%s", `[+1/${moment.duration(cooldown).format("s")}s]`)}`, `${player.ress.energy || 0}/${maxEnergy}`, true)
        .addField(`📊 ${lang.inventory.stats}:`, `${Emotes.ATK} ATK: ${player.data.ATK}\n${Emotes.DEF} DEF: ${player.data.DEF}\n${Emotes.chests.Tools.rune_pickaxe} Power : ${player.data.power}`, true)
        .addField(`Autres:`, `${Emotes.cash} Balance: ${nFormatter(player.data.money)}\n${Emotes.rep} Reputations : ${player.data.rep}`, true)

    var txt = [],
        txt2 = [],
        txt3 = [],
        txt4 = [],
        txt5 = [],
        txt6 = [];

    for (const ressource in Default.pickaxe.R1) {
        txt.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.ress[ressource])}`);
    }
    for (const ressource in Default.pickaxe.R2) {
        txt2.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.ress[ressource])}`);
    }
    for (const runes in Default.runes.Weapons) {
        txt3.push(`${Emotes.chests.Weapons[runes]} ${nFormatter(player.ress[runes])}`)
    }
    for (const runes in Default.runes.Tools) {
        txt4.push(`${Emotes.chests.Tools[runes]} ${nFormatter(player.ress[runes])}`)
    }
    for (const runes in Default.runes.Gear.P1) {
        txt5.push(`${Emotes.chests.Gear.P1[runes]} ${nFormatter(player.ress[runes])}`)
    }
    for (const runes in Default.runes.Gear.P2) {
        txt6.push(`${Emotes.chests.Gear.P2[runes]} ${nFormatter(player.ress[runes])}`)
    }

    const embed2 = new Discord.MessageEmbed()
        .setFooter(`Page 2/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`${Emotes.ressource} ${lang.inventory.ressources} (1)`, txt, true)
        .addField(`${Emotes.ressource} ${lang.inventory.ressources} (2)`, txt2, true)
        .addField(`${Emotes.gem} ${lang.inventory.gems}`, `${Emotes.sapphire} ${player.prospect.sapphire} ${Emotes.amber} ${player.prospect.amber} ${Emotes.citrine} ${player.prospect.citrine} ${Emotes.ruby} ${player.prospect.ruby} ${Emotes.jade} ${player.prospect.jade} ${Emotes.amethyst} ${player.prospect.amethyst}`)

    const embed3 = new Discord.MessageEmbed()
        .setFooter(`Page 3/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`${Emotes.rune} ${lang.inventory.runes}`, `${txt3.join(" ")}\n${txt4.join(" ")}\n${txt5.join(" ")}\n${txt6.join(" ")}`)
        .addField(`${Emotes.bag} ${lang.inventory.yourObjects}`, `${Emotes.torch} ${player.ress.torch}`)
        .addField(`${Emotes.open_chest} ${lang.inventory.chests}`, `${Emotes.chest_d} ${player.ress.chest_d} ${Emotes.chest_c} ${player.ress.chest_c} ${Emotes.chest_b} ${player.ress.chest_b} ${Emotes.chest_a} ${player.ress.chest_a} ${Emotes.chest_s} ${player.ress.chest_s}`)
 
    const P1 = ["head", "shoulders", "chest", "wrists"];
    const P2 = ["hands", "waist", "legs", "feet"];
    const weapons = ["sword", "shield"];

    let pickaxe = Items.tools.pickaxe[player.items.pickaxe];

    const embed4 = new Discord.MessageEmbed()
        .setFooter(`Page 4/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`) 
        
    weapons.forEach(element => {
        let part = Items.tools[element][player.items[element]];
        let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]

        if (enchantmentLevel) embed4.addField(`${Emotes.chests.Weapons[`rune_${element}`]} ${lang.inventory[element]}:`, `${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`rune_${element}`]}]`, true)
        else embed4.addField(`${Emotes.chests.Weapons[`rune_${element}`]} ${lang.inventory[element]}:`, `${part.name}\n${lang.inventory.level}: ${player.items[element]}`, true)
    });

    let enchantmentLevel = player.enchant.ench_pickaxe > 0 ? player.enchant.ench_pickaxe + Number(0) : player.enchant.ench_pickaxe
    if (enchantmentLevel) embed4.addField(`${Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}\n[${lang.inventory.enchant} ${player.enchant.ench_pickaxe}]`, true)
    else embed4.addField(`${Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}`, true)
    
    P1.forEach(element => {
        let part = Items.armors[element][player.items[element]];
        let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]
 
        if (enchantmentLevel) embed4.addField(`${Emotes.chests.Gear.P1[`rune_${element}`]} ${lang.inventory[element]}:`, `${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`ench_${element}`]}]`, true)
        else embed4.addField(`${Emotes.chests.Gear.P1[`rune_${element}`]} ${lang.inventory[element]}:`, `${part.name}\n${lang.inventory.level}: ${player.items[element]}`, true)
    });
   
    P2.forEach(element => {
        let part = Items.armors[element][player.items[element]];
        let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]
  
        if (enchantmentLevel) embed4.addField(`${Emotes.chests.Gear.P2[`rune_${element}`]} ${lang.inventory[element]}:`, `${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`ench_${element}`]}]`, true)
        else embed4.addField(`${Emotes.chests.Gear.P2[`rune_${element}`]} ${lang.inventory[element]}:`, `${part.name}\n${lang.inventory.level}: ${player.items[element]}`, true)
    });

    let dungeon_amulet = Items.objects.dungeon_amulet[player.items.dungeon_amulet]
    let ring = Items.objects.ring[player.items.ring]

    const embed5 = new Discord.MessageEmbed()
        .setFooter(`Page 5/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .setDescription(`${Emotes.bag} ${lang.inventory.objects}`)
        .addField(`${Emotes.dungeon_amulet} ${lang.inventory.dungeon_amulet}:`, `${dungeon_amulet.name}\n${lang.inventory.level}: ${player.items.dungeon_amulet}`, true)
        .addField(`${Emotes.ring} ${lang.inventory.ring}:`, `${ring.name}\n${lang.inventory.level}: ${player.items.ring}`, true)

    const embeds = [
        embed1,
        embed2,
        embed3,
        embed4,
        embed5
    ];
    for (let i = 0; i < 0; ++i)
    embeds.push(new Discord.MessageEmbed());
    const wow = new Pagination.Embeds()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPageIndicator(false)
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)

    switch (args[0]) {
        case "1":
            wow.setPage(1);
            break;
        case "2":
            wow.setPage(2);
            break;
        case "3":
            wow.setPage(3);
            break;
        case "4":
            wow.setPage(4);
            break;
        case "5":
            wow.setPage(5);
            break;
        default:
            wow.setPage(1);
            break;
    }
    wow.build();
}

module.exports.help = {
    name: 'inventory',
    description_fr: 'Affiche votre inventaire',
    description_en: 'Display your inventory',
    usage_fr: '(page)',
    usage_en: '(page)',
    category: 'RPG',
    aliases: ['inv', 'i']
}
