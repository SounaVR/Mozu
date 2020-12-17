const Discord = require('discord.js');
const Default = require('../../utils/default.json');

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
  const Tools = require(`../../utils/items/tools/${player.data.lang}.json`);
  const Armor = require(`../../utils/items/armors/${player.data.lang}.json`);
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
      .setAuthor(`${lang.inventory.inventory} ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.member.displayColor)
      .setFooter(`Page 1/3 | ${lang.help}`)
      .addField(`⭐ Mana`, `${player.data.mana}/50`, true)
      .addField(`❤️ PV`, `${player.data.PV}/50`, true)
      .addField(`⚡ ${lang.inventory.energy} [+1/5s]`, `${player.data.energy || 0}/100`, true)
      .addField(`🆙 ${lang.inventory.level}`, `${player.data.level} [${Default.emotes.idk} Exp: ${player.data.XP}]`, true)
      .addField(`${Default.emotes.cash} Balance: ${nFormatter(player.data.money)}`, `${Default.emotes.idk} Reputations : ${player.data.rep}`, true)
      .addField(`⚔️ ${lang.inventory.combat}:`, `${Default.emotes.rune_sword} ATK: ${player.data.ATK}\n${Default.emotes.rune_shield} DEF: ${player.data.DEF}`, true)

    const embed2 = new Discord.MessageEmbed()
      .setAuthor(`${lang.inventory.inventory} ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.member.displayColor)
      .setFooter(`Page 2/3 | ${lang.help}`)

    var txt = []
    for (const ressource in Default.pickaxe.R1) {
      txt.push(`${Default.emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.data[ressource])}`);
    }
    var txt2 = []
    for (const ressource in Default.pickaxe.R2) {
      txt2.push(`${Default.emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.data[ressource])}`);
    }
    var txt3 = []
    for (const runes in Default.runes[player.data.classe]) {
      txt3.push(`${Default.emotes[runes]} ${nFormatter(player.data[runes])}`)
    }
    var txt4 = []
    for (const rune in Default.runes.other) {
      txt4.push(`${Default.emotes[rune]} ${nFormatter(player.data[rune])}`)
    }
    embed2.addField(`${Default.emotes.ressource} ${lang.inventory.ressources} (1)`, txt, true)
    embed2.addField(`${Default.emotes.ressource} ${lang.inventory.ressources} (2)`, txt2, true)
    embed2.addField(`${Default.emotes.rune} ${lang.inventory.rune}`, `${txt3.join(" ")} ${txt4.join(" ")}`)
    embed2.addField(`${Default.emotes.bag} ${lang.inventory.obj}`, `${Default.emotes.dungeon_stone} ${player.data.dungeon_stone}`)
    embed2.addField(`${Default.emotes.open_chest} ${lang.inventory.chests}`, `${Default.emotes.locked_chest} ${player.data.chest_d}`)

    let levelPick = Math.floor(player.data.pickaxe)
    let pickaxe = Tools.pickaxe[levelPick];

    let levelSword = Math.floor(player.data.sword)
    let sword = Tools.sword[levelSword];
    let levelShield = Math.floor(player.data.shield)
    let shield = Tools.shield[levelShield];
    let levelWand = Math.floor(player.data.wand)
    let wand = Tools.wand[levelWand];
    let levelBow = Math.floor(player.data.bow)
    let bow = Tools.bow[levelBow];

    let levelTete = Math.floor(player.data.tete)
    let tete = Armor[player.data.classe].tete[levelTete]
    let levelEpaule = Math.floor(player.data.epaule)
    let epaule = Armor[player.data.classe].epaule[levelEpaule]
    let levelTorse = Math.floor(player.data.torse)
    let torse = Armor[player.data.classe].torse[levelTorse]
    let levelPoignets = Math.floor(player.data.poignets)
    let poignets = Armor[player.data.classe].poignets[levelPoignets]
    let levelMains = Math.floor(player.data.mains)
    let mains = Armor[player.data.classe].mains[levelMains]
    let levelTaille = Math.floor(player.data.taille)
    let taille = Armor[player.data.classe].taille[levelTaille]
    let levelJambes = Math.floor(player.data.jambes)
    let jambes = Armor[player.data.classe].jambes[levelJambes]
    let levelPieds = Math.floor(player.data.pieds)
    let pieds = Armor[player.data.classe].pieds[levelPieds]

    const embed3 = new Discord.MessageEmbed()
      .setAuthor(`${lang.inventory.inventory} ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.member.displayColor)
      .setFooter(`Page 3/3 | ${lang.help}`)

    if (player.data.classe === "Guerrier") {
      embed3.setDescription(`${lang.inventory.class} : ${lang.inventory.war}`)
      embed3.addField(`${Default.emotes.rune_sword} ${lang.inventory.sword}:`, `${sword.name}\n${lang.inventory.level}: ${levelSword}\n[${lang.inventory.enchant}: ${player.data.ench_sword}]`, true)
      embed3.addField(`${Default.emotes.rune_shield} ${lang.inventory.shield}:`, `${shield.name}\n${lang.inventory.level}: ${levelShield}\n[${lang.inventory.enchant}: ${player.data.ench_shield}]`, true)
    } else if (player.data.classe === "Mage") {
      embed3.setDescription(`${lang.inventory.class} : ${lang.inventory.mage}`)
      embed3.addField(`${Default.emotes.rune_wand} ${lang.inventory.wand}:`, `${wand.name}\n${lang.inventory.level}: ${levelWand}\n[${lang.inventory.enchant}: ${player.data.ench_wand}]`, true)
    } else if (player.data.classe === "Chasseur") {
      embed3.setDescription(`${lang.inventory.class} : ${lang.inventory.hunt}`)
      embed3.addField(`${Default.emotes.rune_bow} ${lang.inventory.bow}:`, `${bow.name}\n${lang.inventory.level}: ${levelBow}\n[${lang.inventory.enchant}: ${player.data.ench_bow}]`, true)
    }
    embed3.addField(`${Default.emotes.rune_pickaxe} ${lang.inventory.pickaxe}:`, `${pickaxe.name}\n${lang.inventory.level}: ${levelPick}\n[${lang.inventory.enchant}: ${player.data.ench_pickaxe}]`, true)
    if (player.data.classe !== "Guerrier") {
      embed3.addField('\u200b', '\u200b', true)
    }  
    embed3.addField(`${Default.emotes.rune_tete} ${lang.inventory.tete}`, `${tete.name}\n${lang.inventory.level}: ${levelTete}\n[${lang.inventory.enchant}: ${player.data.ench_tete}]`, true)
    embed3.addField(`${Default.emotes.rune_epaule} ${lang.inventory.epaule}`, `${epaule.name}\n${lang.inventory.level}: ${levelEpaule}\n[${lang.inventory.enchant}: ${player.data.ench_epaule}]`, true)
    embed3.addField(`${Default.emotes.rune_torse} ${lang.inventory.torse}`, `${torse.name}\n${lang.inventory.level}: ${levelTorse}\n[${lang.inventory.enchant}: ${player.data.ench_torse}]`, true)
    embed3.addField(`${Default.emotes.rune_poignets} ${lang.inventory.poignets}`, `${poignets.name}\n${lang.inventory.level}: ${levelPoignets}\n[${lang.inventory.enchant}: ${player.data.ench_poignets}]`, true)
    embed3.addField(`${Default.emotes.rune_mains} ${lang.inventory.mains}`, `${mains.name}\n${lang.inventory.level}: ${levelMains}\n[${lang.inventory.enchant}: ${player.data.ench_mains}]`, true)
    embed3.addField(`${Default.emotes.rune_taille} ${lang.inventory.taille}`, `${taille.name}\n${lang.inventory.level}: ${levelTaille}\n[${lang.inventory.enchant}: ${player.data.ench_taille}]`, true)
    embed3.addField(`${Default.emotes.rune_jambes} ${lang.inventory.jambes}`, `${jambes.name}\n${lang.inventory.level}: ${levelJambes}\n[${lang.inventory.enchant}: ${player.data.ench_jambes}]`, true)
    if (player.data.classe !== "Guerrier") {
      embed3.addField('\u200b', '\u200b', true)
    }  
    embed3.addField(`${Default.emotes.rune_pieds} ${lang.inventory.pieds}`, `${pieds.name}\n${lang.inventory.level}: ${levelPieds}\n[${lang.inventory.enchant}: ${player.data.ench_pieds}]`, true)

  const Pagination = require('discord-paginationembed');
  const { MessageEmbed } = require('discord.js');
  const embeds = [
    embed1,
    embed2,
    embed3
  ];
  for (let i = 0; i < 0; ++i)
  embeds.push(new MessageEmbed().setFooter(`Page ${i + 1}`));
  const wow = new Pagination.Embeds()
    .setArray(embeds)
    .setAuthorizedUsers([message.author.id])
    .setChannel(message.channel)
    .setPageIndicator(false)
    .setAuthor(`${lang.inventory.inventory} ${message.author.tag}`, message.author.displayAvatarURL())
    .setColor(message.member.displayColor)
  if (!args[0] || args[0] === "1") {
    wow.setPage(1)
  } else if (args[0] === "2") {
    wow.setPage(2)
  } else if (args[0] === "3") {
    wow.setPage(3)
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
