const { MessageButton, MessageActionRow } = require('discord-buttons');
const Discord = require('discord.js'),
Default       = require('../../utils/default.json'),
Emotes        = require('../../utils/emotes.json'),
manageBind    = require('../../functions/manageBind');

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
    let disabledButton = new MessageButton().setLabel("Timeout").setStyle("grey").setEmoji("780222833808506920").setID("disabled").setDisabled();

    // gear buttons
    let head = new MessageButton().setLabel("head").setStyle("blurple").setEmoji("748959964663382106").setID("head");
    let shoulders = new MessageButton().setLabel("shoulders").setStyle("blurple").setEmoji("748959724170379324").setID("shoulders");
    let chest = new MessageButton().setLabel("chest").setStyle("blurple").setEmoji("748960199389479053").setID("chest");
    let wrists = new MessageButton().setLabel("wrists").setStyle("blurple").setEmoji("748960470479798324").setID("wrists");
    let hands = new MessageButton().setLabel("hands").setStyle("blurple").setEmoji("748960653930135613").setID("hands");
    let waist = new MessageButton().setLabel("waist").setStyle("blurple").setEmoji("748961288960606300").setID("waist");
    let legs = new MessageButton().setLabel("legs").setStyle("blurple").setEmoji("748961288968994888").setID("legs");
    let feet = new MessageButton().setLabel("feet").setStyle("blurple").setEmoji("748961289145155684").setID("feet");

    // gems buttons
    let sapphireButton = new MessageButton().setLabel("sapphire").setStyle("blurple").setEmoji("831956969854205952").setID("sapphire");
    let amberButton = new MessageButton().setLabel("amber").setStyle("blurple").setEmoji("831956970448748544").setID("amber");
    let citrineButton = new MessageButton().setLabel("citrine").setStyle("blurple").setEmoji("831956970499211354").setID("citrine");
    let rubyButton = new MessageButton().setLabel("ruby").setStyle("blurple").setEmoji("831956969492709463").setID("ruby");
    let jadeButton = new MessageButton().setLabel("jade").setStyle("blurple").setEmoji("831957224020246570").setID("jade");
    let amethystButton = new MessageButton().setLabel("amethyst").setStyle("blurple").setEmoji("831956970428563486").setID("amethyst");

    // sockets buttons
    let socket1 = new MessageButton().setLabel("n°1").setStyle("blurple").setEmoji("858821600400113704").setID("socket1");
    let socket2 = new MessageButton().setLabel("n°2").setStyle("blurple").setEmoji("858821600400113704").setID("socket2");
    let socket3 = new MessageButton().setLabel("n°3").setStyle("blurple").setEmoji("858821600400113704").setID("socket3");

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
    let gearRow1 = new MessageActionRow()
    .addComponents([head, shoulders, chest, wrists]);

    let gearRow2 = new MessageActionRow()
    .addComponents([hands, waist, legs, feet]);

    // gem rows
    let gemRow1 = new MessageActionRow()
    .addComponents([sapphireButton, amberButton, citrineButton]);

    let gemRow2 = new MessageActionRow()
    .addComponents([rubyButton, jadeButton, amethystButton]);

    const bind = await message.channel.send({ components: [gearRow1, gearRow2], embed: gearEmbed });

    const filter = (button) => button.clicker.user.id === message.author.id; //user filter (author only)
    const collector = bind.createButtonCollector(filter, { time: 60000 }); //collector for 60 seconds

    var gem;
    var part;
    var stat;

    collector.on('collect', button => {
        // socket row
        let socketRow = new MessageActionRow()
        .addComponents([socket1, socket2, socket3]);

        switch (button.id) {
            case "head":
                part = "head";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("head", head);
                break;
            case "shoulders":
                part = "shoulders";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("shoulders", shoulders);
                break;
            case "chest":
                part = "chest";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("chest", chest);
                break;
            case "wrists":
                part = "wrists";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("wrists", wrists);
                break;
            case "hands":
                part = "hands";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("hands", hands);
                break;
            case "waist":
                part = "waist";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("waist", waist);
                break;
            case "legs":
                part = "legs";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("legs", legs);
                break;
            case "feet":
                part = "feet";
                bind.edit({ components: [gemRow1, gemRow2], embed: gemEmbed });
                test("feet", feet);
                break;
            
            case "sapphire":
                gem = "sapphire";
                stat = "power";
                bind.edit({ component: socketRow, embed: socketEmbed });
                break;
            case "amber":
                gem = "amber";
                stat = "energyCooldown";
                bind.edit({ component: socketRow, embed: socketEmbed });
                break;
            case "citrine":
                gem = "citrine";
                stat = "MANA";
                bind.edit({ component: socketRow, embed: socketEmbed });
                break;
            case "ruby":
                gem = "ruby";
                stat = "HP";
                bind.edit({ component: socketRow, embed: socketEmbed });
                break;
            case "jade":
                gem = "jade";
                stat = "ATK";
                bind.edit({ component: socketRow, embed: socketEmbed });
                break;
            case "amethyst":
                gem = "amethyst";
                stat = "DEF";
                bind.edit({ component: socketRow, embed: socketEmbed });
                break;

            case "socket1":
                manageBind(con, player, message, gem, part, `slot_a_${part}`, stat, bind);
                collector.stop("success");
                break;
            case "socket2":
                manageBind(con, player, message, gem, part, `slot_b_${part}`, stat, bind);
                collector.stop("success");
                break;
            case "socket3":
                manageBind(con, player, message, gem, part, `slot_c_${part}`, stat, bind);
                collector.stop("success");
                break;
            }
    })

    collector.on('end', (reason) => {
        if (reason && reason === "success") {
            return;
        } else bind.edit(disabledButton);
    }); //need to fix
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