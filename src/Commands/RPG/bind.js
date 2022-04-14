const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js'),
Default       = require('../../../utils/default.json'),
Emotes        = require('../../../utils/emotes.json'),
manageBind    = require('../../../functions/manageBind');

module.exports = {
    name: 'bind',
    description: 'Pour sertir des gemmes sur votre équipement',
    async execute(client, interaction) {
        const { user, member } = interaction;

        const emptySocket = "https://cdn.discordapp.com/attachments/691992473999769623/850298943467159552/emptySocket.png";
        const con = client.connection;
        const player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(`${Default.notRegistered}`);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const gearEmbed = new MessageEmbed()
            .setColor(member.displayColor)
            .setTitle(lang.bind.title)
            .setThumbnail(emptySocket)
            .addField("Description", lang.bind.description)
            .addField("Documentation", lang.bind.gearDoc)
            .addField(lang.bind.gearField, lang.bind.gearInfo)
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });

        const gemEmbed = new MessageEmbed()
            .setColor(member.displayColor)
            .setTitle(lang.bind.title)
            .setThumbnail(emptySocket)
            .addField("Documentation", lang.bind.gemDoc)
            .addField(lang.bind.notEnoughGem, lang.bind.notEnoughGemDoc)
            .addField("Stock", `${Emotes.sapphire} Sapphire : ${player.prospect.sapphire}\n${Emotes.amber} Amber : ${player.prospect.amber}\n${Emotes.citrine} Citrine : ${player.prospect.citrine}\n${Emotes.ruby} Ruby : ${player.prospect.ruby}\n${Emotes.jade} Jade : ${player.prospect.jade}\n${Emotes.amethyst} Amethyst : ${player.prospect.amethyst}`)
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });

        const socketEmbed = new MessageEmbed()
            .setColor(member.displayColor)
            .setTitle(lang.bind.title)
            .setThumbnail(emptySocket)
            .addField("Documentation", lang.bind.socketDoc)
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });

        // timeout button
        let disabledButton = new MessageButton().setLabel("Timeout").setStyle("grey").setCustomId("disabled").setDisabled();

        // gear buttons
        let head = new MessageButton().setLabel(lang.inventory.head).setStyle("PRIMARY").setCustomId("head");
        let shoulders = new MessageButton().setLabel(lang.inventory.shoulders).setStyle("PRIMARY").setCustomId("shoulders");
        let chest = new MessageButton().setLabel(lang.inventory.chest).setStyle("PRIMARY").setCustomId("chest");
        let wrists = new MessageButton().setLabel(lang.inventory.wrists).setStyle("PRIMARY").setCustomId("wrists");
        let hands = new MessageButton().setLabel(lang.inventory.hands).setStyle("PRIMARY").setCustomId("hands");
        let waist = new MessageButton().setLabel(lang.inventory.waist).setStyle("PRIMARY").setCustomId("waist");
        let legs = new MessageButton().setLabel(lang.inventory.legs).setStyle("PRIMARY").setCustomId("legs");
        let feet = new MessageButton().setLabel(lang.inventory.feet).setStyle("PRIMARY").setCustomId("feet");

        // gems buttons
        let sapphireButton = new MessageButton().setLabel("sapphire").setStyle("PRIMARY").setCustomId("sapphire");
        let amberButton = new MessageButton().setLabel("amber").setStyle("PRIMARY").setCustomId("amber");
        let citrineButton = new MessageButton().setLabel("citrine").setStyle("PRIMARY").setCustomId("citrine");
        let rubyButton = new MessageButton().setLabel("ruby").setStyle("PRIMARY").setCustomId("ruby");
        let jadeButton = new MessageButton().setLabel("jade").setStyle("PRIMARY").setCustomId("jade");
        let amethystButton = new MessageButton().setLabel("amethyst").setStyle("PRIMARY").setCustomId("amethyst");

        // sockets buttons
        let socket1 = new MessageButton().setLabel("n°1").setStyle("PRIMARY").setCustomId("socket1");
        let socket2 = new MessageButton().setLabel("n°2").setStyle("PRIMARY").setCustomId("socket2");
        let socket3 = new MessageButton().setLabel("n°3").setStyle("PRIMARY").setCustomId("socket3");

        const gearArray = [head, shoulders, chest, wrists, hands, waist, legs, feet];
        const gemArray = [sapphireButton, amberButton, citrineButton, rubyButton, jadeButton, amethystButton];
        const gearArray2 = ["head", "shoulders", "chest", "wrists", "hands", "waist", "legs", "feet"];
        const gemArray2 = ["sapphire", "amber", "citrine", "ruby", "jade", "amethyst"];
        const statArray = ["power", "energyCooldown", "MANA", "HP", "ATK", "DEF"];
        const sockets = [socket1, socket2, socket3];

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
        const disableSocketButtons = async function(part) {
            for (let i = 2; i > player.items[part]; i--) {
                sockets[i]?.setDisabled(true);
            }
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

        // socket rows
        let socketRow = new MessageActionRow()
            .addComponents([socket1, socket2, socket3]);

        const bind = await interaction.reply({ components: [gearRow1, gearRow2], embeds: [gearEmbed], fetchReply: true });

        const filter = (button) => button.user.id === interaction.user.id; //user filter (author only)
        const collector = bind.createMessageComponentCollector({ filter, time: 60000 }); //collector for 60 seconds

        let gem;
        let part;
        let stat;
        let number;

        collector.on('collect', button => {
            if (!button.isButton()) return;
            if (gearArray2.includes(button.customId)) {
                part = button.customId;
                button.update({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                disableSocketButtons(part);
            } else if (gemArray2.includes(button.customId)) {
                number = gemArray2.indexOf(button.customId)+1;
                stat = statArray[number-1];
                gem = button.customId;
                button.update({ components: [socketRow], embeds: [socketEmbed] });
            } else {
                const slot = button.customId.split('').pop();
                manageBind(con, player, interaction, gem, part, stat, bind, number, slot);
                collector.stop();
            }
        });
    
        collector.on('end', () => {
            interaction.editReply({ components: [], embeds: [gearEmbed] });
        });
    }
}

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