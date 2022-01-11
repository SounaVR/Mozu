require("moment-duration-format");
const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js'),
    moment           = require('moment'),
    simplydjs        = require('simply-djs-v13'),
    Default          = require('../../utils/default.json'),
    Emotes           = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const Items = require(`../../utils/items/${player.data.lang}.json`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const maxEnergy = Items.objects.ring[player.items.ring].energy;
    const maxHP = 50;
    const energyCooldown = player.data.energyCooldown;
    const hpCooldown = player.data.hpCooldown;
    
    const embed1 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 1/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`⭐ Mana`, `${player.data.MANA}/50`, true)
        .addField(`❤️ HP [+1/${moment.duration(hpCooldown).format("s")}s]`, `${player.data.HP || 0}/${maxHP}`, true)
        .addField(`⚡ ${lang.inventory.energy.replace("%s", `[+1/${moment.duration(energyCooldown).format("s")}s]`)}`, `${player.ress.energy || 0}/${maxEnergy}`, true)
        .addField(`📊 ${lang.inventory.stats}:`, `${Emotes.ATK} ATK: ${player.data.ATK}\n${Emotes.DEF} DEF: ${player.data.DEF}\n${Emotes.chests.Tools.rune_pickaxe} Power : ${player.data.power}`, true)
        .addField(`Autres:`, `${Emotes.cash} Balance: ${nFormatter(player.data.money)}\n${Emotes.rep} Reputations : ${player.data.rep}`, true)

    var txt = [],
        txt2 = [],
        txt3 = [],
        txt4 = [],
        txt5 = [],
        txt6 = [],
        txt7 = [];

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
    for (const chest in Emotes.explore) {
        txt7.push(`${Emotes.explore[chest]} ${player.ress[chest]}`)
    }

    const embed2 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 2/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`${Emotes.ressource} ${lang.inventory.ressources} (1)`, txt.join('\n'), true)
        .addField(`${Emotes.ressource} ${lang.inventory.ressources} (2)`, txt2.join('\n'), true)
        .addField(`${Emotes.gem} ${lang.inventory.gems}`, `${Emotes.sapphire} ${player.prospect.sapphire} ${Emotes.amber} ${player.prospect.amber} ${Emotes.citrine} ${player.prospect.citrine} ${Emotes.ruby} ${player.prospect.ruby} ${Emotes.jade} ${player.prospect.jade} ${Emotes.amethyst} ${player.prospect.amethyst}`)

    const embed3 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 3/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`${Emotes.rune} ${lang.inventory.runes}`, `${txt3.join(" ")}\n${txt4.join(" ")}\n${txt5.join(" ")}\n${txt6.join(" ")}`)
        .addField(`${Emotes.bag} ${lang.inventory.yourObjects}`, `${Emotes.torch} ${player.ress.torch}`)
        .addField(`${Emotes.open_chest} ${lang.inventory.chests}`, txt7.join(" "))
 
    const gear = ["head", "shoulders", "chest", "wrists", "hands", "waist", "legs", "feet"];
    const weapons = ["sword", "shield"];

    let pickaxe = Items.tools.pickaxe[player.items.pickaxe];

    const embed4 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
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
    
    gear.forEach(element => {
        var slot1;
        var slot2;
        var slot3;
        const slot_a = player.slots[`slot_a_${element}`]-1;
        const slot_b = player.slots[`slot_b_${element}`]-1;
        const slot_c = player.slots[`slot_c_${element}`]-1;

        if (slot_a <= -1) slot1 = `${Emotes.emptySocket}`;
        else slot1 = `${Emotes.gems[slot_a]}`;
        if (slot_b <= -1) slot2 = `${Emotes.emptySocket}`;
        else slot2 = `${Emotes.gems[slot_b]}`;
        if (slot_c <= -1) slot3 = `${Emotes.emptySocket}`;
        else slot3 = `${Emotes.gems[slot_c]}`;

        let part = Items.armors[element][player.items[element]];
        let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]
 
        if (enchantmentLevel) embed4.addField(`${Emotes.enchant[`rune_${element}`]} ${lang.inventory[element]}:`, `${slot1 + "" + slot2 + "" + slot3}\n${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`ench_${element}`]}]`, true)
        else embed4.addField(`${Emotes.enchant[`rune_${element}`]} ${lang.inventory[element]}:`, `${slot1 + "" + slot2 + "" + slot3}\n${part.name}\n${lang.inventory.level}: ${player.items[element]}`, true)
    });

    let dungeon_amulet = Items.objects.dungeon_amulet[player.items.dungeon_amulet];
    let ring = Items.objects.ring[player.items.ring];

    const embed5 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 5/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .setDescription(`${Emotes.bag} ${lang.inventory.objects}`)
        .addField(`${Emotes.dungeon_amulet} ${lang.inventory.dungeon_amulet}:`, `${dungeon_amulet.name}\n${lang.inventory.level}: ${player.items.dungeon_amulet}`, true)
        .addField(`${Emotes.ring} ${lang.inventory.ring}:`, `${ring.name}\n${lang.inventory.level}: ${player.items.ring}`, true)

    const pages = [
        embed1,
        embed2,
        embed3,
        embed4,
        embed5
    ];

    simplydjs.embedPages(client, message, pages, { color: 'green' })
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
