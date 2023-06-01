const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js'),
Default       = require('../../utils/default.json'),
Emotes        = require('../../utils/emotes.json'),
manageBind    = require('../../functions/manageBind');

module.exports = {
    data: {
        name: "bind",
        description: "To set gems on your equipment",
        descriptionLocalizations: {
            fr: "Pour sertir des gemmes sur votre équipement"
        },
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const { user, member } = interaction;

        const emptySocket = "https://cdn.discordapp.com/emojis/1084492365168922714.webp";
        const player = await client.getPlayer(user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const gearEmbed = new EmbedBuilder()
            .setColor(member.displayColor)
            .setTitle(lang.bind.title)
            .setThumbnail(emptySocket)
            .addFields(
                { name: "Description", value: lang.bind.description },
                { name: "Documentation", value: lang.bind.gearDoc },
                { name: lang.bind.gearField, value: lang.bind.gearInfo }
            )
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });

        const gemEmbed = new EmbedBuilder()
            .setColor(member.displayColor)
            .setTitle(lang.bind.title)
            .setThumbnail(emptySocket)
            .addFields(
                { name: "Documentation", value: lang.bind.gemDoc },
                { name: lang.bind.notEnoughGem, value: lang.bind.notEnoughGemDoc }    ,
                { name: "Stock", value: `${Emotes.sapphire} Sapphire : ${player.prospect.sapphire}\n${Emotes.amber} Amber : ${player.prospect.amber}\n${Emotes.citrine} Citrine : ${player.prospect.citrine}\n${Emotes.ruby} Ruby : ${player.prospect.ruby}\n${Emotes.jade} Jade : ${player.prospect.jade}\n${Emotes.amethyst} Amethyst : ${player.prospect.amethyst}` }
            )
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });

        const socketEmbed = new EmbedBuilder()
            .setColor(member.displayColor)
            .setTitle(lang.bind.title)
            .setThumbnail(emptySocket)
            .addFields({ name: "Documentation", value: lang.bind.socketDoc })
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });

        // sockets buttons
        const sockets = [...Array(3)].map((_,i) => new ButtonBuilder().setLabel(`n°${i+1}`).setStyle(ButtonStyle.Primary).setCustomId(`socket${i}`));
        const gearArray = ["head", "shoulders", "chest", "wrists", "hands", "waist", "legs", "feet"];
        const gemArray = ["sapphire", "amber", "citrine", "ruby", "jade", "amethyst"];
        const statArray = ["power", "energyCooldown", "MANA", "HP", "ATK", "DEF"];
        const gearButtons = gearArray.map(e => new ButtonBuilder().setLabel(e).setStyle(ButtonStyle.Primary).setCustomId(e));
        const gemButtons = gemArray.map(e => new ButtonBuilder().setLabel(e).setStyle(ButtonStyle.Primary).setCustomId(e));

        // just checking if the user have the correct level or enough gems
        gearButtons.forEach(gear => {
            let level = player.items[gear.data.label];
            if (level <= 0) gear.setDisabled(true);
        });

        gemButtons.forEach(gem => {
            let value = player.prospect[gem.data.label];
            if (value <= 0) gem.setDisabled(true);
        });

        // function for disable socket buttons
        const disableSocketButtons = async function(part) {
            for (let i = 2; i >= player.items[part]; i--) {
                sockets[i]?.setDisabled(true);
            }
        }

        // gear rows
        let gearRow1 = new ActionRowBuilder()
            .addComponents(gearButtons.slice(0, 4));

        let gearRow2 = new ActionRowBuilder()
            .addComponents(gearButtons.slice(4));

        // gem rows
        let gemRow1 = new ActionRowBuilder()
            .addComponents(gemButtons.slice(0, 3));

        let gemRow2 = new ActionRowBuilder()
            .addComponents(gemButtons.slice(3));

        // socket rows
        let socketRow = new ActionRowBuilder()
            .addComponents(sockets);

        const bind = await interaction.reply({ components: [gearRow1, gearRow2], embeds: [gearEmbed], fetchReply: true });
        const collector = bind.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        let gem;
        let part;
        let stat;
        let number;

        collector.on('collect', button => {
            if (!button.isButton()) return;
            if (button.user.id !== interaction.user.id) return button.reply({ content: lang.notTheAuthorOfTheInteraction, ephemeral: true });
            if (gearArray.includes(button.customId)) {
                part = button.customId;
                button.update({ components: [gemRow1, gemRow2], embeds: [gemEmbed] });
                disableSocketButtons(part);
            } else if (gemArray.includes(button.customId)) {
                number = gemArray.indexOf(button.customId)+1;
                stat = statArray[number-1];
                gem = button.customId;
                button.update({ components: [socketRow], embeds: [socketEmbed] });
            } else {
                const slot = +(button.customId.at(-1));
                manageBind(client.connection, player, interaction, gem, part, stat, bind, number, slot);
                collector.stop();
            }
        });

        collector.on('end', () => {
            interaction.editReply({ components: [], embeds: [gearEmbed] });
        });
    }
}