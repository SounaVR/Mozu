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
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.");
  const lang = require(`../../utils/text/${player.data.lang}.json`);
  let userid = message.author.id;
  const cooldown = 5000;

  if ((Date.now() - player.data.LastActivity) - cooldown > 0) {
    const timeObj = Date.now() - player.data.LastActivity
    const gagnees = Math.floor(timeObj / cooldown)

    player.data.energy = (player.data.energy || 0) + gagnees
    if (player.data.energy > 100) player.data.energy = 100
    con.query(`UPDATE data SET energy = ${player.data.energy}, LastActivity = ${Date.now()} WHERE userid = ${userid}`)
  }

  let level = Math.floor(player.data.pickaxe)
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
  .setColor(message.member.displayColor)

  let xpgained = Math.floor(Math.random() * 3) + 1;
  let xp = player.data.XP + xpgained;

  let m2 = xpgained * args[0];
  let xp2 = player.data.XP + m2;

  let m3 = xpgained * player.data.energy;
  let xp3 = player.data.XP + m3;

  let nxtLvl = Math.round(player.data.level*150*(player.data.level*0.25));
  if (nxtLvl <= player.data.XP) {
      con.query(`UPDATE data SET level = ${player.data.level + 1} WHERE userid = ${userid}`);
  }
  let difference = Math.abs(nxtLvl - player.data.XP);
  //mine
  let drop = Math.ceil(Math.random() * 50) + 13;
  let Coaldrop = Math.ceil(Math.random() * 49) + 12;
  let Cdrop = Math.ceil(Math.random() * 47) + 11;
  let Fdrop = Math.ceil(Math.random() * 32) + 9;
  let Odrop = Math.ceil(Math.random() * 25) + 7;
  let Mdrop = 17 + Number(5);
  //mine [numbers]
  let two = drop * args[0];
  let three = Coaldrop * args[0];
  let four = Cdrop * args[0];
  let five = Fdrop * args[0];
  let six = Odrop * args[0];
  let seven = Mdrop * args[0];
  //mine all
  let un = drop * player.data.energy;
  let deux = Coaldrop * player.data.energy;
  let trois = Cdrop * player.data.energy;
  let quatre = Fdrop * player.data.energy;
  let cinq = Odrop * player.data.energy;
  let six_all = Mdrop * player.data.energy;

  //mine [numbers]
  if (args[0] > 0) {
    if (player.data.energy < args[0]) {
      return message.channel.send(lang.mine.errorEnergy);
    }
    con.query(`UPDATE data SET energy = ${player.data.energy} WHERE userid = ${userid}`);
    if (player.data.pickaxe == "0") {
      embed.addField(`${lang.mine.gained}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(two)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(three)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ? WHERE userid = ?`, [xp2, player.data.stone + two, player.data.coal + three, userid]);
    }
    if (player.data.pickaxe == "1") {
      embed.addField(`${lang.mine.gained}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(two)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(three)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(four)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ? WHERE userid = ?`, [xp2, player.data.stone + two, player.data.coal + three, player.data.copper + four, userid]);
    }
    if (player.data.pickaxe == "2") {
      embed.addField(`${lang.mine.gained}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(two)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(three)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(four)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(five)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ? WHERE userid = ?`, [xp2, player.data.stone + two, player.data.coal + three, player.data.copper + four, player.data.iron + five, userid]);
    }
    if (player.data.pickaxe == "3") {
      embed.addField(`${lang.mine.gained}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(two)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(three)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(four)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(five)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(six)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ? WHERE userid = ?`, [xp2, player.data.stone + two, player.data.coal + three, player.data.copper + four, player.data.iron + five, player.data.gold + five, userid]);
    }
    if (player.data.pickaxe == "4") {
      embed.addField(`${lang.mine.gained}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(two)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(three)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(four)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(five)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(six)}\n${Default.emotes.malachite} ${lang.inventory.malachite} : ${nFormatter(seven)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp2, player.data.stone + two, player.data.coal + three, player.data.copper + four, player.data.iron + five, player.data.gold + six, player.data.malachite + seven, userid]);
    }
    if (player.data.pickaxe == "5") {
      embed.addField(`${lang.mine.gained}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(two)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(three)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(four)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(five)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(six)}\n${Default.emotes.malachite} ${lang.inventory.malachite} : ${nFormatter(seven)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp2, player.data.stone + two, player.data.coal + three, player.data.copper + four, player.data.iron + five, player.data.gold + six, player.data.malachite + seven, userid]);
    }

    embed.addField(`${lang.mine.infos}`, `⚡ ${lang.mine.energy_use} : ${args[0]}\n⚡ ${lang.mine.energy_remain} : ${player.data.energy - args[0]}\n${Default.emotes.idk} ${lang.mine.xp_win}: ${m2}`, true);
    embed.addField(`${lang.mine.level}`, `**${lang.mine.mine}** : ${lang.mine.level} **${player.data.level}** | XP : **${player.data.XP + m2}**.`)
    message.channel.send(embed);
    //mine
  } else if (!args[0] || args[0] == 0) {
    if (player.data.energy < 1) {
      return message.channel.send(lang.mine.errorEnergy);
    }
    con.query(`UPDATE data SET energy = ? WHERE userid = ?`, [player.data.energy - 1, userid]);
    if (player.data.pickaxe == "0") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(drop)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(Coaldrop)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ? WHERE userid = ?`, [xp, player.data.stone + drop, player.data.coal + Coaldrop, userid]);
    } else if (player.data.pickaxe == "1") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(drop)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(Coaldrop)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(Cdrop)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ? WHERE userid = ?`, [xp, player.data.stone + drop, player.data.coal + Coaldrop, player.data.copper + Cdrop, userid]);
    } else if (player.data.pickaxe == "2") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(drop)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(Coaldrop)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(Cdrop)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(Fdrop)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ? WHERE userid = ?`, [xp, player.data.stone + drop, player.data.coal + Coaldrop, player.data.copper + Cdrop, player.data.iron + Fdrop, userid]);
    } else if (player.data.pickaxe == "3") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(drop)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(Coaldrop)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(Cdrop)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(Fdrop)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(Odrop)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ? WHERE userid = ?`, [xp, player.data.stone + drop, player.data.coal + Coaldrop, player.data.copper + Cdrop, player.data.iron + Fdrop, player.data.gold + Odrop, userid]);
    } else if (player.data.pickaxe == "4") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(drop)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(Coaldrop)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(Cdrop)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(Fdrop)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(Odrop)}\n${Default.emotes.malachite} ${lang.inventory.malachite} : ${nFormatter(Mdrop)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, player.data.stone + drop, player.data.coal + Coaldrop, player.data.copper + Cdrop, player.data.iron + Fdrop, player.data.gold + Odrop, player.data.malachite + Mdrop, userid]);
    } else if (player.data.pickaxe == "5") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(drop)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(Coaldrop)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(Cdrop)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(Fdrop)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(Odrop)}\n${Default.emotes.malachite} ${lang.inventory.malachite} : ${nFormatter(Mdrop)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp, player.data.stone + drop, player.data.coal + Coaldrop, player.data.copper + Cdrop, player.data.iron + Fdrop, player.data.gold + Odrop, player.data.malachite + Mdrop, userid]);
    }

    embed.addField(`${lang.mine.infos}`, `⚡ ${lang.mine.energy_use} : 1\n⚡ ${lang.mine.energy_remain} : ${player.data.energy - 1}\n${Default.emotes.idk} ${lang.mine.xp_win}: ${xpgained}`, true)
    embed.addField(`${lang.inventory.level}`, `**${lang.mine.mine}** : ${lang.inventory.level} **${player.data.level}** | XP : **${xp}**.`)
    message.channel.send(embed);
    //mine all
  } else if (args[0] === "all" || args[0] === "a") {
    if (player.data.energy < 1) {
      return message.channel.send(lang.mine.errorEnergy);
    }
    con.query(`UPDATE data SET energy = ? WHERE userid = ?`, [0, userid]);
    if (player.data.pickaxe == "0") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(un)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(deux)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ? WHERE userid = ?`, [xp3, player.data.stone + un, player.data.coal + deux, userid]);
    }
    if (player.data.pickaxe == "1") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(un)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(deux)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(trois)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ? WHERE userid = ?`, [xp3, player.data.stone + un, player.data.coal + deux, player.data.copper + trois, userid]);
    }
    if (player.data.pickaxe == "2") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(un)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(deux)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(trois)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(quatre)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ? WHERE userid = ?`, [xp3, player.data.stone + un, player.data.coal + deux, player.data.copper + trois, player.data.iron + trois, userid]);
    }
    if (player.data.pickaxe == "3") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(un)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(deux)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(trois)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(quatre)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(cinq)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ? WHERE userid = ?`, [xp3, player.data.stone + un, player.data.coal + deux, player.data.copper + trois, player.data.iron + quatre, player.data.gold + cinq, userid]);
    }
    if (player.data.pickaxe == "4") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(un)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(deux)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(trois)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(quatre)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(cinq)}\n${Default.emotes.malachite} ${lang.inventory.malachite} : ${nFormatter(six_all)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp3, player.data.stone + un, player.data.coal + deux, player.data.copper + trois, player.data.iron + quatre, player.data.gold + cinq, player.data.malachite + six_all, userid]);
    }
    if (player.data.pickaxe == "5") {
      embed.addField(`${lang.mine.mine}`, `${Default.emotes.stone} ${lang.inventory.stone} : ${nFormatter(un)}\n${Default.emotes.coal} ${lang.inventory.coal} : ${nFormatter(deux)}\n${Default.emotes.copper} ${lang.inventory.copper} : ${nFormatter(trois)}\n${Default.emotes.iron} ${lang.inventory.iron} : ${nFormatter(quatre)}\n${Default.emotes.gold} ${lang.inventory.gold} : ${nFormatter(cinq)}\n${Default.emotes.malachite} ${lang.inventory.malachite} : ${nFormatter(six_all)}`);
      con.query(`UPDATE data SET XP = ?, stone = ?, coal = ?, copper = ?, iron = ?, gold = ?, malachite = ? WHERE userid = ?`, [xp3, player.data.stone + un, player.data.coal + deux, player.data.copper + trois, player.data.iron + quatre, player.data.gold + cinq, player.data.malachite + six_all, userid]);
    }

    embed.addField(`${lang.mine.infos}`, `⚡ ${lang.mine.energy_use} : ${player.data.energy}\n⚡ ${lang.mine.energy_remain} : 0\n${Default.emotes.idk} ${lang.mine.xp_win}: ${m3}`, true);
    embed.addField(`${lang.inventory.level}`, `**${lang.mine.mine}** : ${lang.inventory.level} **${player.data.level}** | XP : **${player.data.XP + m3}**.`)
    message.channel.send(embed);
  }
}

module.exports.help = {
    name: "mine",
    description_fr: "Pour miner des ressources",
    description_en: "For resource mining",
    usage_fr: "(nombre d'énergie) ou (all)",
    usage_en: "(number of energy) or (all)",
    category: "RPG",
    aliases: ["m", "mi"]
};
