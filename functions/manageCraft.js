const { nFormatter } = require('../utils/u.js');
const Discord        = require('discord.js'),
    Emotes           = require('../utils/emotes.json'),
    moment           = require('moment');

module.exports = async function manageCraft(con, player, args, message, category, objectName, emote) {
    const Craft = require(`../utils/items/${player.data.lang}.json`);
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];

    const level = Math.floor(player.items[objectName])+1;
    const levelTitle = Math.floor(player.items[objectName]);

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    let validButton = new Discord.MessageButton().setStyle("SUCCESS").setEmoji(react[0]).setCustomId("valid");
    let cancelButton = new Discord.MessageButton().setStyle("DANGER").setEmoji(react[1]).setCustomId("cancel");

    var currentObject = [];
    var currentObjectTitle = [];
    let txt = [];
    let reward = [];
    let sql = [];
    var amount;

    if (!Craft[category][objectName][level]) return message.reply(`${lang.craft.maxLevel}`);

    currentObject = Craft[category][objectName][level];
    currentObjectTitle = Craft[category][objectName][levelTitle];

    for (const ressource in currentObject.ressource) {
        if (player.ress[ressource.toLowerCase()] < currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(currentObject.ressource[ressource]-player.ress[ressource.toLowerCase()]))})`);
        if (player.ress[ressource.toLowerCase()] >= currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.checked})`);
    }
    
    embed.setTitle(`${lang.craft.upgrade.replace("%a", `"${currentObjectTitle.name}"`).replace("%n", `"${currentObject.name}"`)}`);

    const maxEnergy = Craft.objects.ring[player.items.ring].energy;
    if (objectName === "pickaxe") reward.push(`💪 Power : ${player.data.power} => **${player.data.power + Number(Craft.tools.pickaxe[level].power)}**`);
    if (objectName === "ring") reward.push(`⚡Energy : ${maxEnergy} => **${currentObject.energy}**\n⏲️ Energy Cooldown : ${moment.duration(player.data.energyCooldown).format("s")}s => **${moment.duration(currentObject.cooldown).format("s")}s**`)

    embed.addField(`**${lang.craft.cost}**`, txt.join("\n"));

    let rewardLength = reward.join("\n") ? reward.length >= 1 : reward.join("\n");
    if (rewardLength) embed.addField(`**Reward**`, `${emote} ${currentObject.name}\n${reward.join("\n")}`);
    else embed.addField(`**Reward**`, `${emote} ${currentObject.name}`);

    for (var ressource in currentObject.ressource) {
        let ress;
        ress = currentObject.ressource[ressource];

        if (player.ress[ressource.toLowerCase()] < ress) {
            validButton.setDisabled(true);
            cancelButton.setDisabled(true);
        }
        sql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`);
    }

    let buttonRow = new Discord.MessageActionRow()
        .addComponents([validButton, cancelButton]);

    const msg = await message.channel.send({embeds: [embed], components: [buttonRow]});

    const filter = (button) => button.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter,time: 30000 });

    collector.on('collect', button => {
        validButton.setDisabled(true);
        cancelButton.setDisabled(true);
        switch(button.customId) {
            case "valid":
                con.query(`UPDATE data SET power = ${currentObject.power > 0 ? player.data.power + Number(currentObject.power) : player.data.power} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE ress SET ${sql.join(',')} WHERE userid = ${message.author.id}`);
                switch (objectName) {
                    case "ring":
                        con.query(`UPDATE data SET energyCooldown = ${currentObject.cooldown} WHERE userid = ${message.author.id}`);
                        con.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);
                        break;
                
                    default:
                        con.query(`UPDATE items SET ${objectName} = ${level} WHERE userid = ${message.author.id}`);
                        break;
                }
                collector.stop();
                return message.channel.send(`${lang.craft.done.replace("%s", `**${currentObject.name}**`)}.`);

            case "cancel":
                collector.stop();
                return message.channel.send(`${lang.craft.canceled}`);
        }
    })

    collector.on('end', () => {
        msg.edit({ components: [], embeds: [embed]})
    })

}