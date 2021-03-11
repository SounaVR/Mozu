const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js'),
Emotes               = require('../../utils/emotes.json'),
Default              = require('../../utils/default.json');

async function manageCraft(con, player, message, category, objectName) {
    const Craft = require(`../../utils/items/${player.data.lang}.json`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];

    const level = Math.floor(player.data[objectName])+1;
    const levelTitle = Math.floor(player.data[objectName]);

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    var currentObject = [];
    var currentObjectTitle = [];
    if (category === "armors") {
        if (!Craft[category][objectName][level]) return message.channel.send(`${lang.craft.maxLevel}`);
        currentObject = Craft[category][objectName][level];
        currentObjectTitle = Craft[category][objectName][levelTitle];
    } else if (category === "objects" && objectName === "dungeon_stone") {
        let filter = (m) => m.author.id === message.author.id;

        message.channel.send(`${lang.craft.typingNumber}`);
        const collector = new Discord.MessageCollector(message.channel, filter, {
            time: 30000
        });

        collector.on("collect", async (response) => {
            const reponse = response.content;

            if (isNaN(reponse) || reponse == 0) {
                message.channel.send(`${lang.craft.validNumber}`);
            } else if (reponse > 0) {
                collector.stop();
                let currentObject = Craft[category][objectName][0];

                embed.setTitle(`Craft "${currentObject.name}" x${reponse} ?`)

                let txt = [];
                for (const ressource in currentObject.ressource) {
                    if (player.data[ressource.toLowerCase()] <= currentObject.ressource[ressource] * reponse) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * reponse)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor((currentObject.ressource[ressource] * reponse)-player.data[ressource.toLowerCase()]))})`);
                    if (player.data[ressource.toLowerCase()] >= currentObject.ressource[ressource] * reponse) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource] * reponse)} (${Emotes.checked})`);
                }
                embed.addField("**Cost**", txt);

                const msg = await message.channel.send(embed);
                await msg.react(react[0]);
                await msg.react(react[1]);

                let filterReactions = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

                msg.awaitReactions(filterReactions, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    let reaction = collected.first();

                    switch (reaction.emoji.id) {
                        case react[0]:
                            let need = [];
                            let resssql = [];

                            for (var ressource in currentObject.ressource) {
                                if (player.data[ressource.toLowerCase()] < currentObject.ressource[ressource]) need.push(`sorry bro`);
                                resssql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource] * reponse}`);
                            }
                            if (need.length >= 1) return message.channel.send(`${lang.craft.notEnoughRess}`);

                            con.query(`UPDATE data SET ${resssql.join(',')}, ${objectName} = ${player.data.dungeon_stone + Number(reponse)} WHERE userid = ${message.author.id}`);
                            msg.delete();

                            return message.channel.send(`${lang.craft.done} **${currentObject.name}** x${reponse} !`);

                        case react[1]:
                            return message.channel.send(`${lang.craft.canceled}`);
                    }
                }).catch(() => {
                    msg.reactions.removeAll();
                });
            }
        })
    } else {
        if (!Craft[category][objectName][level]) return message.channel.send(`${lang.craft.maxLevel}`);
        currentObject = Craft[category][objectName][level];
        currentObjectTitle = Craft[category][objectName][levelTitle];
    }
    embed.setTitle(`Upgrade "${currentObjectTitle.name}" to "${currentObject.name}" ?`)
    let txt = [];
    for (const ressource in currentObject.ressource) {
        if (player.data[ressource.toLowerCase()] < currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(currentObject.ressource[ressource]-player.data[ressource.toLowerCase()]))})`);
        if (player.data[ressource.toLowerCase()] >= currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.checked})`);
    }
    embed.addField("**Cost**", txt);

    const msg = await message.channel.send(embed);

    await msg.react(react[0]);
    await msg.react(react[1]);

    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
        let reaction = collected.first();

        switch(reaction.emoji.id) {
            case react[0]:
                let need = [];
                let resssql = [];

                for (var ressource in currentObject.ressource) {
                    if (player.data[ressource.toLowerCase()] < currentObject.ressource[ressource]) need.push(`sorry bro`);
                    resssql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`);
                }
                if (need.length >= 1) return message.channel.send(`${lang.craft.notEnoughRess}`);

                con.query(`UPDATE data SET ${resssql.join(',')}, ATK = ${player.data.ATK + Number(currentObject.ATK)}, DEF = ${player.data.DEF + Number(currentObject.DEF)}, ${objectName} = ${level} WHERE userid = ${message.author.id}`);
                msg.delete();

                return message.channel.send(`${lang.craft.done} **${currentObject.name}** !`);

            case react[1]:
                return message.channel.send(`${lang.craft.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;
    const cooldown = 5000;

    if ((Date.now() - player.data.LastActivity) - cooldown > 0) {
        const timeObj = Date.now() - player.data.LastActivity;
        const gagnees = Math.floor(timeObj / cooldown);

        player.data.energy = (player.data.energy || 0) + gagnees;
        if (player.data.energy > 100) player.data.energy = 100;
        con.query(`UPDATE data SET energy = ${player.data.energy}, LastActivity = ${Date.now()} WHERE userid = ${userid}`);
    }

    const craftEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.description}`)
        .addField("Documentation", `${lang.craft.doc} [ pickaxe ]\n[ sword / shield ]\n[ head / shoulders / bust / wrist\nhands / waist / legs / foots ]\n[ dungeon_amulet / dungeon_stone ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    switch (args[0]) {
        case "p": case "pick": case "pickaxe":
            return manageCraft(con, player, message, "tools", "pickaxe");
        case "sw": case "sword":
            return manageCraft(con, player, message, "tools", "sword");
        case "sh": case "shield":
            return manageCraft(con, player, message, "tools", "shield");
        case "head":
            return manageCraft(con, player, message, "armors", "tete");
        case "shoulders":
            return manageCraft(con, player, message, "armors", "epaule");
        case "bust":
            return manageCraft(con, player, message, "armors", "torse");
        case "wrist":
            return manageCraft(con, player, message, "armors", "poignets");
        case "hands":
            return manageCraft(con, player, message, "armors", "mains");
        case "waist":
            return manageCraft(con, player, message, "armors", "taille");
        case "legs":
            return manageCraft(con, player, message, "armors", "jambes");
        case "foots":
            return manageCraft(con, player, message, "armors", "pieds");
        case "dungeon_amulet":
            return manageCraft(con, player, message, "objects", "dungeon_amulet");
        case "dungeon_stone":
            return manageCraft(con, player, message, "objects", "dungeon_stone");
        default:
            return message.channel.send(craftEmbed);
    }
};

exports.help = {
    name: "craft",
    description_fr: "Pour fabriquer ou améliorer votre équipement actuel.",
    description_en: "To craft or upgrade your current equipment.",
    usage_fr: "<équipement>",
    usage_en: "<equipment>",
    category: "RPG",
    aliases: ["cra"]
};
