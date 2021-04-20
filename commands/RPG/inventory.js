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
    const cooldown = Items.objects.ring[player.items.ring].cooldown;
    
    const embed1 = new Discord.MessageEmbed()
        .setAuthor(`${lang.inventory.inventoryOf} ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 1/4 | ${lang.globalHelpFooter}`)
        .addField(`⭐ Mana`, `${player.data.MANA}/50`, true)
        .addField(`❤️ PV`, `${player.data.PV}/50`, true)
        .addField(`⚡ ${lang.inventory.energy} [+1/${moment.duration(cooldown).format("s")}s]`, `${player.ress.energy || 0}/${maxEnergy}`, true)
        .addField(`⚔️ ${lang.inventory.combat}:`, `${Emotes.chests.Guerrier.rune_sword} ATK: ${player.data.ATK}\n${Emotes.chests.Guerrier.rune_shield} DEF: ${player.data.DEF}`, true)
        .addField(`Autres:`, `${Emotes.cash} Balance: ${nFormatter(player.data.money)}\n${Emotes.rep} Reputations : ${player.data.rep}`, true)

    const embed2 = new Discord.MessageEmbed()
        .setAuthor(`${lang.inventory.inventory} ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 2/4 | ${lang.globalHelpFooter}`)

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
    for (const runes in Default.runes.Guerrier) {
        txt3.push(`${Emotes.chests.Guerrier[runes]} ${nFormatter(player.ress[runes])}`)
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

    embed2.addField(`${Emotes.ressource} ${lang.inventory.ressources} (1)`, txt, true)
    embed2.addField(`${Emotes.ressource} ${lang.inventory.ressources} (2)`, txt2, true)
    embed2.addField(`${Emotes.rune} ${lang.inventory.runes}`, `${txt3.join(" ")}\n${txt4.join(" ")}\n${txt5.join(" ")}\n${txt6.join(" ")}`)
    embed2.addField(`${Emotes.bag} ${lang.inventory.yourObjects}`, `${Emotes.dungeon_stone} ${player.ress.dungeon_stone}`)
    embed2.addField(`${Emotes.open_chest} ${lang.inventory.chests}`, `${Emotes.chest_d} ${player.ress.chest_d} ${Emotes.chest_c} ${player.ress.chest_c} ${Emotes.chest_b} ${player.ress.chest_b} ${Emotes.chest_a} ${player.ress.chest_a} ${Emotes.chest_s} ${player.ress.chest_s}`)
    embed2.addField(`${Emotes.gem} ${lang.inventory.gems}`, `${Emotes.sapphire} ${player.prospect.sapphire} ${Emotes.amber} ${player.prospect.amber} ${Emotes.citrine} ${player.prospect.citrine} ${Emotes.ruby} ${player.prospect.ruby} ${Emotes.jade} ${player.prospect.jade} ${Emotes.amethyst} ${player.prospect.amethyst}`)

    let pickaxe = Items.tools.pickaxe[player.items.pickaxe];

    let sword = Items.tools.sword[player.items.sword];
    let shield = Items.tools.shield[player.items.shield];

    let head = Items.armors.head[player.items.head]
    let shoulders = Items.armors.shoulders[player.items.shoulders]
    let chest = Items.armors.chest[player.items.chest]
    let wrists = Items.armors.wrists[player.items.wrists]
    let hands = Items.armors.hands[player.items.hands]
    let waist = Items.armors.waist[player.items.waist]
    let legs = Items.armors.legs[player.items.legs]
    let feet = Items.armors.feet[player.items.feet]

    let dungeon_amulet = Items.objects.dungeon_amulet[player.items.dungeon_amulet]
    let ring = Items.objects.ring[player.items.ring]

    const embed3 = new Discord.MessageEmbed()
        .setAuthor(`${lang.inventory.inventoryOf} ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 3/4 | ${lang.globalHelpFooter}`)
        .addField(`${Emotes.chests.Guerrier.rune_sword} ${lang.inventory.sword}:`, `${sword.name}\n${lang.inventory.level}: ${player.items.sword}\n[${lang.inventory.enchant}: ${player.enchant.ench_sword}]`, true)
        .addField(`${Emotes.chests.Guerrier.rune_shield} ${lang.inventory.shield}:`, `${shield.name}\n${lang.inventory.level}: ${player.items.shield}\n[${lang.inventory.enchant}: ${player.enchant.ench_shield}]`, true)      
    
        .addField(`${Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}\n[${lang.inventory.enchant}: ${player.enchant.ench_pickaxe}]`, true)
        
        .addField(`${Emotes.chests.Gear.P1.rune_head} ${lang.inventory.head}:`, `${head.name}\n${lang.inventory.level}: ${player.items.head}\n[${lang.inventory.enchant}: ${player.enchant.ench_head}]`, true)
        .addField(`${Emotes.chests.Gear.P1.rune_shoulders} ${lang.inventory.shoulders}:`, `${shoulders.name}\n${lang.inventory.level}: ${player.items.shoulders}\n[${lang.inventory.enchant}: ${player.enchant.ench_shoulders}]`, true)
        .addField(`${Emotes.chests.Gear.P1.rune_chest} ${lang.inventory.chest}:`, `${chest.name}\n${lang.inventory.level}: ${player.items.chest}\n[${lang.inventory.enchant}: ${player.enchant.ench_chest}]`, true)
        .addField(`${Emotes.chests.Gear.P1.rune_wrists} ${lang.inventory.wrists}:`, `${wrists.name}\n${lang.inventory.level}: ${player.items.wrists}\n[${lang.inventory.enchant}: ${player.enchant.ench_wrists}]`, true)
        .addField(`${Emotes.chests.Gear.P2.rune_hands} ${lang.inventory.hands}:`, `${hands.name}\n${lang.inventory.level}: ${player.items.hands}\n[${lang.inventory.enchant}: ${player.enchant.ench_hands}]`, true)
        .addField(`${Emotes.chests.Gear.P2.rune_waist} ${lang.inventory.waist}:`, `${waist.name}\n${lang.inventory.level}: ${player.items.waist}\n[${lang.inventory.enchant}: ${player.enchant.ench_waist}]`, true)
        .addField(`${Emotes.chests.Gear.P2.rune_legs} ${lang.inventory.legs}:`, `${legs.name}\n${lang.inventory.level}: ${player.items.legs}\n[${lang.inventory.enchant}: ${player.enchant.ench_legs}]`, true)
        .addField(`${Emotes.chests.Gear.P2.rune_feet} ${lang.inventory.feet}:`, `${feet.name}\n${lang.inventory.level}: ${player.items.feet}\n[${lang.inventory.enchant}: ${player.enchant.ench_feet}]`, true)

    const embed4 = new Discord.MessageEmbed()
    .setAuthor(`${lang.inventory.inventoryOf} ${message.author.tag}`, message.author.displayAvatarURL())
    .setColor(message.member.displayColor)
    .setFooter(`Page 4/4 | ${lang.globalHelpFooter}`)
    .setDescription(`${Emotes.bag} ${lang.inventory.objects}`)
    .addField(`${Emotes.dungeon_amulet} ${lang.inventory.dungeon_amulet}:`, `${dungeon_amulet.name}\n${lang.inventory.level}: ${player.items.dungeon_amulet}`, true)
    .addField(`${Emotes.ring} ${lang.inventory.ring}:`, `${ring.name}\n${lang.inventory.level}: ${player.items.ring}`, true)

    const embeds = [
        embed1,
        embed2,
        embed3,
        embed4
    ];
    for (let i = 0; i < 0; ++i)
    embeds.push(new Discord.MessageEmbed().setFooter(`Page ${i + 1}`));
    const wow = new Pagination.Embeds()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPageIndicator(false)
        .setAuthor(`${lang.inventory.inventoryOf} ${message.author.tag}`, message.author.displayAvatarURL())
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
  category: 'RPG',
  aliases: ['inv', 'i']
}
