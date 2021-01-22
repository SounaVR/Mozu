const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js');
const Pagination     = require('discord-paginationembed');
const Default        = require('../../utils/default.json');
const Emotes         = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!profile` command to remedy this.")
    const Items = require(`../../utils/items/${player.data.lang}.json`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;
    const cooldown = 5000;

    if ((Date.now() - player.data.LastActivity) - cooldown > 0) {
      const timeObj = Date.now() - player.data.LastActivity
      const gagnees = Math.floor(timeObj / cooldown)

      player.data.energy = (player.data.energy || 0) + gagnees
      if (player.data.energy > 100) player.data.energy = 100
      con.query(`UPDATE data SET energy = ${player.data.energy}, LastActivity = ${Date.now()} WHERE userid = ${userid}`)
    }
    const embed1 = new Discord.MessageEmbed()
      .setAuthor(`${lang.inventory.inventoryOf} ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.member.displayColor)
      .setFooter(`Page 1/4 | ${lang.globalHelpFooter}`)
      .addField(`⭐ Mana`, `${player.data.MANA}/50`, true)
      .addField(`❤️ PV`, `${player.data.PV}/50`, true)
      .addField(`⚡ ${lang.inventory.energy} [+1/5s]`, `${player.data.energy || 0}/100`, true)
      .addField(`🆙 ${lang.inventory.level}`, `${player.data.level} [${Emotes.idk} Exp: ${player.data.xp}]`, true)
      .addField(`${Emotes.cash} Balance: ${nFormatter(player.data.money)}`, `${Emotes.rep} Reputations : ${player.data.rep}`, true)
      .addField(`⚔️ ${lang.inventory.combat}:`, `${Emotes.chests.Guerrier.rune_sword} ATK: ${player.data.ATK}\n${Emotes.chests.Guerrier.rune_shield} DEF: ${player.data.DEF}`, true)

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
        txt.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.data[ressource])}`);
    }
    for (const ressource in Default.pickaxe.R2) {
        txt2.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.data[ressource])}`);
    }
    for (const runes in Default.runes[player.data.classe]) {
        txt3.push(`${Emotes.chests[player.data.classe][runes]} ${nFormatter(player.data[runes])}`)
    }
    for (const runes in Default.runes.Tools) {
        txt4.push(`${Emotes.chests.Tools[runes]} ${nFormatter(player.data[runes])}`)
    }
    for (const runes in Default.runes.Gear.P1) {
        txt5.push(`${Emotes.chests.Gear.P1[runes]} ${nFormatter(player.data[runes])}`)
    }
    for (const runes in Default.runes.Gear.P2) {
        txt6.push(`${Emotes.chests.Gear.P2[runes]} ${nFormatter(player.data[runes])}`)
    }

    embed2.addField(`${Emotes.ressource} ${lang.inventory.ressources} (1)`, txt, true)
    embed2.addField(`${Emotes.ressource} ${lang.inventory.ressources} (2)`, txt2, true)
    embed2.addField(`${Emotes.rune} ${lang.inventory.runes}`, `${txt3.join(" ")}\n${txt4.join(" ")}\n${txt5.join(" ")}\n${txt6.join(" ")}`)
    embed2.addField(`${Emotes.bag} ${lang.inventory.yourObjects}`, `${Emotes.dungeon_stone} ${player.data.dungeon_stone}`)
    embed2.addField(`${Emotes.open_chest} ${lang.chest.rarity}/${lang.inventory.chests}`, `${Emotes.chest_d} ${player.data.chest_d} ${Emotes.chest_c} ${player.data.chest_c} ${Emotes.chest_b} ${player.data.chest_b} ${Emotes.chest_a} ${player.data.chest_a} ${Emotes.chest_s} ${player.data.chest_s}`)

    let pickaxe = Items.tools.pickaxe[player.data.pickaxe];

    let sword = Items.tools.sword[player.data.sword];
    let shield = Items.tools.shield[player.data.shield];
    let wand = Items.tools.wand[player.data.wand];
    let bow = Items.tools.bow[player.data.bow];

    let tete = Items.armors[player.data.classe].tete[player.data.tete]
    let epaule = Items.armors[player.data.classe].epaule[player.data.epaule]
    let torse = Items.armors[player.data.classe].torse[player.data.torse]
    let poignets = Items.armors[player.data.classe].poignets[player.data.poignets]
    let mains = Items.armors[player.data.classe].mains[player.data.mains]
    let taille = Items.armors[player.data.classe].taille[player.data.taille]
    let jambes = Items.armors[player.data.classe].jambes[player.data.jambes]
    let pieds = Items.armors[player.data.classe].pieds[player.data.pieds]

    let dungeon_amulet = Items.objects.dungeon_amulet[player.data.dungeon_amulet]

    const embed3 = new Discord.MessageEmbed()
      .setAuthor(`${lang.inventory.inventoryOf} ${message.author.tag}`, message.author.displayAvatarURL())
      .setDescription(`${lang.inventory.class} : ${lang.inventory.classes[player.data.classe]}`)
      .setColor(message.member.displayColor)
      .setFooter(`Page 3/4 | ${lang.globalHelpFooter}`)

    switch(player.data.classe) {
        case "Guerrier":
            embed3.addField(`${Emotes.chests.Guerrier.rune_sword} ${lang.inventory.sword}:`, `${sword.name}\n${lang.inventory.level}: ${player.data.sword}\n[${lang.inventory.enchant}: ${player.data.ench_sword}]`, true)
            embed3.addField(`${Emotes.chests.Guerrier.rune_shield} ${lang.inventory.shield}:`, `${shield.name}\n${lang.inventory.level}: ${player.data.shield}\n[${lang.inventory.enchant}: ${player.data.ench_shield}]`, true)
            break;
        case "Mage":
            embed3.addField(`${Emotes.chests.Mage.rune_wand} ${lang.inventory.wand}:`, `${wand.name}\n${lang.inventory.level}: ${player.data.wand}\n[${lang.inventory.enchant}: ${player.data.ench_wand}]`, true)
            break;
        case "Chasseur":
            embed3.addField(`${Emotes.chests.Chasseur.rune_bow} ${lang.inventory.bow}:`, `${bow.name}\n${lang.inventory.level}: ${player.data.bow}\n[${lang.inventory.enchant}: ${player.data.ench_bow}]`, true)
            break;
    }

    embed3.addField(`${Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, `${pickaxe.name}\n${lang.inventory.level}: ${player.data.pickaxe}\n[${lang.inventory.enchant}: ${player.data.ench_pickaxe}]`, true)
    if (player.data.classe !== "Guerrier") {
      embed3.addField('\u200b', '\u200b', true)
    }
    embed3.addField(`${Emotes.chests.Gear.P1.rune_tete} ${lang.inventory.Gear.P1.rune_tete}:`, `${tete.name}\n${lang.inventory.level}: ${player.data.tete}\n[${lang.inventory.enchant}: ${player.data.ench_tete}]`, true)
    embed3.addField(`${Emotes.chests.Gear.P1.rune_epaule} ${lang.inventory.Gear.P1.rune_epaule}:`, `${epaule.name}\n${lang.inventory.level}: ${player.data.epaule}\n[${lang.inventory.enchant}: ${player.data.ench_epaule}]`, true)
    embed3.addField(`${Emotes.chests.Gear.P1.rune_torse} ${lang.inventory.Gear.P1.rune_torse}:`, `${torse.name}\n${lang.inventory.level}: ${player.data.torse}\n[${lang.inventory.enchant}: ${player.data.ench_torse}]`, true)
    embed3.addField(`${Emotes.chests.Gear.P1.rune_poignets} ${lang.inventory.Gear.P1.rune_poignets}:`, `${poignets.name}\n${lang.inventory.level}: ${player.data.poignets}\n[${lang.inventory.enchant}: ${player.data.ench_poignets}]`, true)
    embed3.addField(`${Emotes.chests.Gear.P2.rune_mains} ${lang.inventory.Gear.P2.rune_mains}:`, `${mains.name}\n${lang.inventory.level}: ${player.data.mains}\n[${lang.inventory.enchant}: ${player.data.ench_mains}]`, true)
    embed3.addField(`${Emotes.chests.Gear.P2.rune_taille} ${lang.inventory.Gear.P2.rune_taille}:`, `${taille.name}\n${lang.inventory.level}: ${player.data.taille}\n[${lang.inventory.enchant}: ${player.data.ench_taille}]`, true)
    embed3.addField(`${Emotes.chests.Gear.P2.rune_jambes} ${lang.inventory.Gear.P2.rune_jambes}:`, `${jambes.name}\n${lang.inventory.level}: ${player.data.jambes}\n[${lang.inventory.enchant}: ${player.data.ench_jambes}]`, true)
    if (player.data.classe !== "Guerrier") {
      embed3.addField('\u200b', '\u200b', true)
    }
    embed3.addField(`${Emotes.chests.Gear.P2.rune_pieds} ${lang.inventory.Gear.P2.rune_pieds}:`, `${pieds.name}\n${lang.inventory.level}: ${player.data.pieds}\n[${lang.inventory.enchant}: ${player.data.ench_pieds}]`, true)

    const embed4 = new Discord.MessageEmbed()
    .setAuthor(`${lang.inventory.inventoryOf} ${message.author.tag}`, message.author.displayAvatarURL())
    .setColor(message.member.displayColor)
    .setFooter(`Page 4/4 | ${lang.globalHelpFooter}`)
    .setDescription(`${Emotes.bag} ${lang.inventory.objects}`)
    .addField(`${Emotes.dungeon_amulet} ${lang.inventory.dungeon_amulet}:`, `${dungeon_amulet.name}\n${lang.inventory.level}: ${player.data.dungeon_amulet}`, true)

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
