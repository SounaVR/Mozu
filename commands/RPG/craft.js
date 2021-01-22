const { nFormatter } = require('../../utils/u.js');
const Discord        = require('discord.js'),
Emotes               = require('../../utils/emotes.json'),
Default              = require('../../utils/default.json');

async function manageCraft(client, con, player, message, category, objectName) {
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
        if (!Craft[category][player.data.classe][objectName][level]) return message.channel.send(`${lang.craft.maxLevel}`);
        currentObject = Craft[category][player.data.classe][objectName][level];
        currentObjectTitle = Craft[category][player.data.classe][objectName][levelTitle];
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
                            msg.delete();
                            return message.channel.send(`${lang.craft.canceled}`);
                    }
                }).catch(err => {
                    msg.reactions.removeAll();
                    if (err) console.warn(err);
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
        if (player.data[ressource.toLowerCase()] <= currentObject.ressource[ressource]) txt.push(`${Emotes[ressource]} ${ressource} : ${nFormatter(currentObject.ressource[ressource])} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(currentObject.ressource[ressource]-player.data[ressource.toLowerCase()]))})`);
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
                msg.delete();
                return message.channel.send(`${lang.craft.canceled}`);
        }
    }).catch(err => {
        msg.reactions.removeAll();
        if (err) console.warn(err);
    });
}

exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
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

    var playerClasse;
    if (player.data.classe === "Guerrier") {
        playerClasse = `${Emotes.chests.Guerrier.rune_sword} = ${lang.inventory.sword} ]\n\n- [ ${Emotes.chests.Guerrier.rune_shield} = ${lang.inventory.shield} ]`;
    } else if (player.data.classe === "Mage") {
        playerClasse = `${Emotes.chests.Mage.rune_wand} = ${lang.inventory.wand} ]`;
    } else if (player.data.classe === "Chasseur") {
        playerClasse = `${Emotes.chests.Chasseur.rune_bow} = ${lang.inventory.bow} ]`;
    }

    const craftEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.description}`)
        .addField("Documentation", `${lang.craft.doc} :\n\n- [ ${Emotes.tools} = ${lang.inventory.tools} ]\n\n- [ ${Emotes.weapons} = ${lang.inventory.weapons} ]\n\n- [ ${Emotes.armors} = ${lang.inventory.armors} ]\n\n- [ ${Emotes.bag} = ${lang.inventory.objects} ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    const toolsEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.description}`)
        .addField("Documentation", `${lang.craft.doc2} :\n\n- [ ${Emotes.chests.Tools.rune_pickaxe} = ${lang.inventory.pickaxe} ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    const weaponsEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.description}`)
        .addField("Documentation", `${lang.craft.doc2} :\n\n- [ ${playerClasse}`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    const armorsEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.description}`)
        .addField("Documentation", `${lang.craft.doc2} :

- [ ${Emotes.chests.Gear.P1.rune_tete} = ${lang.inventory.Gear.P1.rune_tete} ]
- [ ${Emotes.chests.Gear.P1.rune_epaule} = ${lang.inventory.Gear.P1.rune_epaule} ]
- [ ${Emotes.chests.Gear.P1.rune_torse} = ${lang.inventory.Gear.P1.rune_torse} ]
- [ ${Emotes.chests.Gear.P1.rune_poignets} = ${lang.inventory.Gear.P1.rune_poignets} ]
- [ ${Emotes.chests.Gear.P2.rune_mains} = ${lang.inventory.Gear.P2.rune_mains} ]
- [ ${Emotes.chests.Gear.P2.rune_taille} = ${lang.inventory.Gear.P2.rune_taille} ]
- [ ${Emotes.chests.Gear.P2.rune_jambes} = ${lang.inventory.Gear.P2.rune_jambes} ]
- [ ${Emotes.chests.Gear.P2.rune_pieds} = ${lang.inventory.Gear.P2.rune_pieds} ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    const objectsEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.description}`)
        .addField("Documentation", `${lang.craft.doc2} :\n\n- [ ${Emotes.dungeon_amulet} = ${lang.inventory.dungeon_amulet}]\n\n- [ ${Emotes.dungeon_stone} = ${lang.inventory.dungeon_stone} ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    const msg = await message.channel.send(craftEmbed);

    let reactMsg = ['756140391186694184', '756140391228637224', '756140390796492903', '748972784432185384'];

    await msg.react(reactMsg[0]);
    await msg.react(reactMsg[1]);
    await msg.react(reactMsg[2]);
    await msg.react(reactMsg[3]);

    const filterMsg = (reaction, user) => reactMsg.includes(reaction.emoji.id) && user.id === message.author.id;

    const collectorMsg = msg.createReactionCollector(filterMsg, { time: 60000 });

    collectorMsg.on('collect', async r => {
        msg.delete();
        switch (r.emoji.id) {
            case reactMsg[0]:
                const tools = await message.channel.send(toolsEmbed);
                let reactTools = ['748973331642056764'];

                await tools.react(reactTools[0])

                const filterTools = (reaction, user) => reactTools.includes(reaction.emoji.id) && user.id === message.author.id;

                const collectorTools = tools.createReactionCollector(filterTools, { time: 60000 });

                collectorTools.on('collect', r => {
                    tools.delete();
                    switch (r.emoji.id) {
                        case reactTools[0]:
                            manageCraft(client, con, player, message, 'tools', 'pickaxe');
                            break;
                    }
                    collectorTools.stop();
                })
                break;

            case reactMsg[1]:
                const weapons = await message.channel.send(weaponsEmbed);

                const reactClasse = [
                    "771095091216515123", //sword
                    "771113421202391051", //shield
                    "748960787946537030", //wand
                    "771331757399212053"  //bow
                ];

                switch(player.data.classe) {
                    case "Guerrier":
                        await weapons.react(reactClasse[0]);
                        await weapons.react(reactClasse[1]);
                        break;
                    case "Mage":
                        await weapons.react(reactClasse[2]);
                        break;
                    case "Chasseur":
                        await weapons.react(reactClasse[3]);
                        break;
                }

                const filterWeapons = (reaction, user) => reactClasse.includes(reaction.emoji.id) && user.id === message.author.id;

                const collectorWeapons = weapons.createReactionCollector(filterWeapons, { time: 60000 });

                collectorWeapons.on('collect', r => {
                    weapons.delete();
                    switch (r.emoji.id) {
                        case reactClasse[0]:
                            manageCraft(client, con, player, message, 'tools', 'sword');
                            break;
                        case reactClasse[1]:
                            manageCraft(client, con, player, message, 'tools', 'shield');
                            break;
                        case reactClasse[2]:
                            manageCraft(client, con, player, message, 'tools', 'wand');
                            break;
                        case reactClasse[3]:
                            manageCraft(client, con, player, message, 'tools', 'bow');
                            break;
                    }
                    collectorWeapons.stop();
                })
                break;

            case reactMsg[2]:
                const armors = await message.channel.send(armorsEmbed);

                let reactArmors = [
                    '748959964663382106', //tete
                    '748959724170379324', //epaule
                    '748960199389479053', //torse
                    '748960470479798324', //poignets
                    '748960653930135613', //mains
                    '748961288960606300', //taille
                    '748961288968994888', //jambes
                    '748961289145155684'  //pieds
                ];

                await armors.react(reactArmors[0]);
                await armors.react(reactArmors[1]);
                await armors.react(reactArmors[2]);
                await armors.react(reactArmors[3]);
                await armors.react(reactArmors[4]);
                await armors.react(reactArmors[5]);
                await armors.react(reactArmors[6]);
                await armors.react(reactArmors[7]);

                const filterArmors = (reaction, user) => reactArmors.includes(reaction.emoji.id) && user.id === message.author.id;

                const collectorArmors = armors.createReactionCollector(filterArmors, { time: 60000 });

                collectorArmors.on('collect', r => {
                    armors.delete();
                    switch (r.emoji.id) {
                        case reactArmors[0]:
                            manageCraft(client, con, args, player, message, 'armors', 'tete');
                            break;
                        case reactArmors[1]:
                            manageCraft(client, con, args, player, message, 'armors', 'epaule');
                            break;
                        case reactArmors[2]:
                            manageCraft(client, con, args, player, message, 'armors', 'torse');
                            break;
                        case reactArmors[3]:
                            manageCraft(client, con, args, player, message, 'armors', 'poignets');
                            break;
                        case reactArmors[4]:
                            manageCraft(client, con, args, player, message, 'armors', 'mains');
                            break;
                        case reactArmors[5]:
                            manageCraft(client, con, args, player, message, 'armors', 'taille');
                            break;
                        case reactArmors[6]:
                            manageCraft(client, con, args, player, message, 'armors', 'jambes');
                            break;
                        case reactArmors[7]:
                            manageCraft(client, con, args, player, message, 'armors', 'pieds');
                            break;

                    }
                    collectorArmors.stop();
                })
                break;

            case reactMsg[3]:
                const objects = await message.channel.send(objectsEmbed);

                let reactObjects = ['780383216334667787', '748972507427635230'];

                await objects.react(reactObjects[0]);
                await objects.react(reactObjects[1]);

                const filterObjects = (reaction, user) => reactObjects.includes(reaction.emoji.id) && user.id === message.author.id;

                const collectorObjects = objects.createReactionCollector(filterObjects, { time: 60000 });

                collectorObjects.on('collect', r => {
                    objects.delete();
                    switch (r.emoji.id) {
                        case reactObjects[0]:
                            manageCraft(client, con, player, message, 'objects', 'dungeon_amulet');
                            break;
                        case reactObjects[1]:
                            manageCraft(client, con, player, message, 'objects', 'dungeon_stone');
                            break;
                    }

                    collectorObjects.stop();
                })
                break;
        }
        collectorMsg.stop();
    });
};

exports.help = {
    name: "craft",
    description_fr: "Pour fabriquer des outils",
    description_en: "For making tools",
    usage_fr: "<outil>",
    usage_en: "<tool>",
    category: "RPG",
    aliases: ["cra"]
};
