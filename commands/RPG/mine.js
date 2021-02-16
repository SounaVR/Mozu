const { nFormatter } = require("../../utils/u.js");
const Discord = require('discord.js');
const Default = require('../../utils/default.json');
const Emotes  = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!profile` command to remedy this.")
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

    // all/a | [numbers] | aucun argument = 1 énergie par commande
    let manaAmount = 'all'.startsWith(args[0]) ? player.data.energy : (!isNaN(args[0]) && args[0] > 0 ? args[0] : 1)
    if(manaAmount > player.data.energy) return message.channel.send(`${lang.mine.notEnoughEnergy}`)

    let Stone  = 0,
    Coal      = 0,
    Copper    = 0,
    Iron      = 0,
    Gold      = 0,
    Malachite = 0;
    // Drop de ressources
    for (let i = 0; i < manaAmount; i++) {
        Stone     += Math.ceil(Math.random() * 50)                               // Pioche level 0
        Coal      += player.data.pickaxe > 0 ? Math.ceil(Math.random() * 49) : 0 // Pioche level 1
        Copper    += player.data.pickaxe > 1 ? Math.ceil(Math.random() * 47) : 0 // Pioche level 2
        Iron      += player.data.pickaxe > 2 ? Math.ceil(Math.random() * 32) : 0 // Pioche level 3
        Gold      += player.data.pickaxe > 3 ? Math.ceil(Math.random() * 25) : 0 // Pioche level 4
        Malachite += player.data.pickaxe > 4 ? Math.ceil(Math.random() * 10) : 0 // Pioche level 5
    }
    let xp = Math.floor(Stone*0.1 + Coal*0.5 + Copper*0.8 + Iron*1 + Gold*2 + Malachite*5)

    const getNeededXP = (level) => level * level * 10;
    const needed = getNeededXP(player.data.level)

    if (xp >= needed) {
        con.query(`UPDATE data SET level = ${player.data.level + Number(1)} WHERE userid = ${userid}`);
    }

    let ressLoot = []
    if (Stone)      ressLoot.push(`${Emotes.stone} ${lang.inventory.stone} : ${Stone}`)
    if (Coal)       ressLoot.push(`${Emotes.coal} ${lang.inventory.coal} : ${Coal}`)
    if (Copper)     ressLoot.push(`${Emotes.copper} ${lang.inventory.copper} : ${Copper}`)
    if (Iron)       ressLoot.push(`${Emotes.iron} ${lang.inventory.iron} : ${Iron}`)
    if (Gold)       ressLoot.push(`${Emotes.gold} ${lang.inventory.gold} : ${Gold}`)
    if (Malachite)  ressLoot.push(`${Emotes.malachite} ${lang.inventory.malachite} : ${Malachite}`)
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setColor(message.member.displayColor)
        .addField(lang.mine.title, ressLoot.join("\n"))
        .addField(lang.mine.infos, `⚡ ${lang.mine.usedEnergy} : ${manaAmount}\n⚡ ${lang.mine.remainingEnergy} : ${player.data.energy-manaAmount}\n${Emotes.idk} ${lang.mine.winnedXP}: ${xp}`, true)
        .addField("XP", `${lang.inventory.level} **${player.data.level}** | xp : **${player.data.xp + xp}**.`)

    message.channel.send(embed);

    con.query(`UPDATE data SET energy = energy - ${manaAmount}, xp = xp + ${xp}, stone = stone + ${Stone}, coal = coal + ${Coal}, copper = copper + ${Copper}, iron = iron + ${Iron}, gold = gold + ${Gold}, malachite = malachite + ${Malachite} WHERE userid = ${userid}`);
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
