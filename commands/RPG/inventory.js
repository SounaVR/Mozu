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
    const energyCooldown = player.data.energyCooldown;
    let pickaxe = Items.tools.pickaxe[player.items.pickaxe];
    let ring = Items.objects.ring[player.items.ring];
    
    const embed1 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 1/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`⭐ Mana`, `${player.data.MANA}/50`, true)
        .addField(`⚡ ${lang.inventory.energy.replace("%s", `[+1/${moment.duration(energyCooldown).format("s")}s]`)}`, `${player.ress.energy || 0}/${maxEnergy}`, true)
        .addField(`📊 ${lang.inventory.stats}:`, `${Emotes.chests.Tools.rune_pickaxe} Power : ${player.data.power}`, true)
        .addField(`Autres:`, `${Emotes.cash} Balance: ${nFormatter(player.data.money)}\n${Emotes.rep} Reputations : ${player.data.rep}`, true)

    var txt = [],
        txt2 = [];

    for (const ressource in Default.pickaxe.R1) {
        txt.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.ress[ressource])}`);
    }
    for (const ressource in Default.pickaxe.R2) {
        txt2.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.ress[ressource])}`);
    }

    const embed2 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 2/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`${Emotes.ressource} ${lang.inventory.ressources} (1)`, txt.join('\n'), true)
        .addField(`${Emotes.ressource} ${lang.inventory.ressources} (2)`, txt2.join('\n'), true)
        
    const embed3 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 3/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .addField(`${Emotes.bag} ${lang.inventory.yourObjects}`, `None`)

    const embed4 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .addField(`${Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}\n`, true)
        .setFooter(`Page 4/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`) 

    const embed5 = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setFooter(`Page 5/5 | ${lang.globalHelpFooter.replace("%s", client.config.prefix)}`)
        .setDescription(`${Emotes.bag} ${lang.inventory.objects}`)
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
