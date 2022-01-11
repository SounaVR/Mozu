const Discord = require('discord.js'),
Default       = require('../../utils/default.json'),
Emotes        = require('../../utils/emotes.json'),
manageBind    = require('../../functions/manageBind');

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 */
exports.run = async (client, message, args, getPlayer, getUser) => {
    const emptySocket = "https://cdn.discordapp.com/attachments/691992473999769623/850298943467159552/emptySocket.png";
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    
    const gearEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle(lang.bind.title)
        .setThumbnail(emptySocket)
        .addField("Description", lang.bind.description)
        .addField("Documentation", lang.bind.gearDoc)
        .addField(lang.bind.gearField, lang.bind.gearInfo)
        .setTimestamp()
        .setFooter(message.author.tag, message.author.displayAvatarURL());

    const gemEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle(lang.bind.title)
        .setThumbnail(emptySocket)
        .addField("Documentation", lang.bind.gemDoc)
        .addField(lang.bind.notEnoughGem, lang.bind.notEnoughGemDoc)
        .addField("Stock", `${Emotes.sapphire} Sapphire : ${player.prospect.sapphire}\n${Emotes.amber} Amber : ${player.prospect.amber}\n${Emotes.citrine} Citrine : ${player.prospect.citrine}\n${Emotes.ruby} Ruby : ${player.prospect.ruby}\n${Emotes.jade} Jade : ${player.prospect.jade}\n${Emotes.amethyst} Amethyst : ${player.prospect.amethyst}`)
        .setTimestamp()
        .setFooter(message.author.tag, message.author.displayAvatarURL());

    const socketEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle(lang.bind.title)
        .setThumbnail(emptySocket)
        .addField("Documentation", lang.bind.socketDoc)
        .setTimestamp()
        .setFooter(message.author.tag, message.author.displayAvatarURL());

    // timeout button
    let disabledButton = new Discord.MessageButton().setLabel("Timeout").setStyle("grey").setEmoji("780222833808506920").setCustomId("disabled").setDisabled();

    // gear buttons
    let head = new Discord.MessageButton().setLabel(lang.inventory.head).setStyle("PRIMARY").setEmoji("748959964663382106").setCustomId("head");
    let shoulders = new Discord.MessageButton().setLabel(lang.inventory.shoulders).setStyle("PRIMARY").setEmoji("748959724170379324").setCustomId("shoulders");
    let chest = new Discord.MessageButton().setLabel(lang.inventory.chest).setStyle("PRIMARY").setEmoji("748960199389479053").setCustomId("chest");
    let wrists = new Discord.MessageButton().setLabel(lang.inventory.wrists).setStyle("PRIMARY").setEmoji("748960470479798324").setCustomId("wrists");
    let hands = new Discord.MessageButton().setLabel(lang.inventory.hands).setStyle("PRIMARY").setEmoji("748960653930135613").setCustomId("hands");
    let waist = new Discord.MessageButton().setLabel(lang.inventory.waist).setStyle("PRIMARY").setEmoji("748961288960606300").setCustomId("waist");
    let legs = new Discord.MessageButton().setLabel(lang.inventory.legs).setStyle("PRIMARY").setEmoji("748961288968994888").setCustomId("legs");
    let feet = new Discord.MessageButton().setLabel(lang.inventory.feet).setStyle("PRIMARY").setEmoji("748961289145155684").setCustomId("feet");

    // gems buttons
    let sapphireButton = new Discord.MessageButton().setLabel("sapphire").setStyle("PRIMARY").setEmoji("831956969854205952").setCustomId("sapphire");
    let amberButton = new Discord.MessageButton().setLabel("amber").setStyle("PRIMARY").setEmoji("831956970448748544").setCustomId("amber");
    let citrineButton = new Discord.MessageButton().setLabel("citrine").setStyle("PRIMARY").setEmoji("831956970499211354").setCustomId("citrine");
    let rubyButton = new Discord.MessageButton().setLabel("ruby").setStyle("PRIMARY").setEmoji("831956969492709463").setCustomId("ruby");
    let jadeButton = new Discord.MessageButton().setLabel("jade").setStyle("PRIMARY").setEmoji("831957224020246570").setCustomId("jade");
    let amethystButton = new Discord.MessageButton().setLabel("amethyst").setStyle("PRIMARY").setEmoji("831956970428563486").setCustomId("amethyst");

    // sockets buttons
    let socket1 = new Discord.MessageButton().setLabel("n°1").setStyle("PRIMARY").setEmoji("858821600400113704").setCustomId("socket1");
    let socket2 = new Discord.MessageButton().setLabel("n°2").setStyle("PRIMARY").setEmoji("858821600400113704").setCustomId("socket2");
    let socket3 = new Discord.MessageButton().setLabel("n°3").setStyle("PRIMARY").setEmoji("858821600400113704").setCustomId("socket3");

    const gearArray = [head, shoulders, chest, wrists, hands, waist, legs, feet];
    const gemArray = [sapphireButton, amberButton, citrineButton, rubyButton, jadeButton, amethystButton];

    // just checking if the user have the correct level or enough gems
    gearArray.forEach(gear => {
        const level = Math.floor(player.items[gear.label]);
        if (level <= 0) gear.setDisabled(true);
    });

    gemArray.forEach(gem => {
        const value = player.prospect[gem.label];
        if (value <= 0) gem.setDisabled(true); 
    });

    // function for disable socket buttons
    const test = async function(objectName) {
        const slot_a = player.slots[`slot_a_${objectName}`]
        const slot_b = player.slots[`slot_b_${objectName}`]
        const slot_c = player.slots[`slot_c_${objectName}`]

        if (slot_a == "-1" || slot_a > 0) socket1.setDisabled(true);
        if (slot_b == "-1" || slot_b > 0) socket2.setDisabled(true);
        if (slot_c == "-1" || slot_c > 0) socket3.setDisabled(true);
    }

    // gear rows
    let gearRow1 = new Discord.MessageActionRow()
    .addComponents([head, shoulders, chest, wrists]);

    let gearRow2 = new Discord.MessageActionRow()
    .addComponents([hands, waist, legs, feet]);

    // gem rows
    let gemRow1 = new Discord.MessageActionRow()
    .addComponents([sapphireButton, amberButton, citrineButton]);

    let gemRow2 = new Discord.MessageActionRow()
    .addComponents([rubyButton, jadeButton, amethystButton]);

    const bind = await message.channel.send({ components: [gearRow1, gearRow2], embeds: [gearEmbed] });

    const filter = (button) => button.user.id === message.author.id; //user filter (author only)
    const collector = bind.createMessageComponentCollector({ filter, time: 60000 }); //collector for 60 seconds

    var gem;
    var part;
    var stat;
    var number;

    collector.on('collect', button => {
        if (!button.isButton()) return
        // socket row
        let socketRow = new Discord.MessageActionRow()
        .addComponents([socket1, socket2, socket3]);

        switch (button.customId) {
            case "head":
                part = "head";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("head", head);
                break;
            case "shoulders":
                part = "shoulders";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("shoulders", shoulders);
                break;
            case "chest":
                part = "chest";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("chest", chest);
                break;
            case "wrists":
                part = "wrists";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("wrists", wrists);
                break;
            case "hands":
                part = "hands";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("hands", hands);
                break;
            case "waist":
                part = "waist";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("waist", waist);
                break;
            case "legs":
                part = "legs";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("legs", legs);
                break;
            case "feet":
                part = "feet";
                bind.edit({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                test("feet", feet);
                break;
            
            case "sapphire":
                gem = "sapphire";
                stat = "power";
                number = 1;
                bind.edit({ components: [socketRow], embeds: [socketEmbed] });
                break;
            case "amber":
                gem = "amber";
                stat = "energyCooldown";
                number = 2;
                bind.edit({ components: [socketRow], embeds: [socketEmbed] });
                break;
            case "citrine":
                gem = "citrine";
                stat = "MANA";
                number = 3;
                bind.edit({ components: [socketRow], embeds: [socketEmbed] });
                break;
            case "ruby":
                gem = "ruby";
                stat = "HP";
                number = 4;
                bind.edit({ components: [socketRow], embeds: [socketEmbed] });
                break;
            case "jade":
                gem = "jade";
                stat = "ATK";
                number = 5;
                bind.edit({ components: [socketRow], embeds: [socketEmbed] });
                break;
            case "amethyst":
                gem = "amethyst";
                stat = "DEF";
                number = 6;
                bind.edit({ components: [socketRow], embeds: [socketEmbed] });
                break;

            case "socket1":
                manageBind(con, player, message, gem, part, `slot_a_${part}`, stat, bind, number);
                collector.stop();
                break;
            case "socket2":
                manageBind(con, player, message, gem, part, `slot_b_${part}`, stat, bind, number);
                collector.stop();
                break;
            case "socket3":
                manageBind(con, player, message, gem, part, `slot_c_${part}`, stat, bind, number);
                collector.stop();
                break;
            }
    })

    collector.on('end', () => {
        bind.edit({ components: [], embeds: [gearEmbed] });
    });
};

exports.help = {
    name: "bind",
    description_fr: "Pour sertir des gemmes sur votre équipement",
    description_en: "To set gems on your equipment",
    category: "RPG",
    aliases: ["b"]
};

// 748959964663382106 head
// 748959724170379324 shoulders
// 748960199389479053 chest
// 748960470479798324 wrists
// 748960653930135613 hands
// 748961288960606300 waist
// 748961288968994888 legs
// 748961289145155684 feet

// sapphire +1 power 831956969854205952
// amber -1sec energy cooldown 831956970448748544
// citrine +1 mana 831956970499211354
// ruby +1 hp 831956969492709463
// jade +1 atk 831957224020246570
// amethyst +1 def 831956970428563486

// socket 858821600400113704