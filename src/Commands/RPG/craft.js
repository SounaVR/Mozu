const { MessageEmbed } = require('discord.js');
const Default = require('../../../utils/default.json'),
Emotes        = require('../../../utils/emotes.json'),
manageCraft   = require('../../../functions/manageCraft');

module.exports = {
    name: 'craft',
    description: 'Pour fabriquer ou améliorer votre équipement actuel.',
    options: [
        {
            name: 'équipement',
            description: 'Choisissez ce que vous voulez crafter.',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'Info',
                    value: 'info'
                },
                {
                    name: 'Pioche',
                    value: 'pickaxe'
                },
                {
                    name: 'Épée',
                    value: 'sword'
                },
                {
                    name: 'Bouclier',
                    value: 'shield'
                },
                {
                    name: 'Tête',
                    value: 'head'
                },
                {
                    name: 'Épaules',
                    value: 'shoulders'
                },
                {
                    name: 'Torse',
                    value: 'chest'
                },
                {
                    name: 'Poignets',
                    value: 'wrists'
                },
                {
                    name: 'Mains',
                    value: 'hands'
                },
                {
                    name: 'Ceinture',
                    value: 'waist'
                },
                {
                    name: 'Jambes',
                    value: 'legs'
                },
                {
                    name: 'Pieds',
                    value: 'feet'
                },
                {
                    name: 'Amulette de donjon',
                    value: 'dungeon_amulet'
                },
                {
                    name: 'Anneau',
                    value: 'ring'
                },
                {
                    name: 'Torche',
                    value: 'torch'
                }
            ]
        }
    ],
    async execute(client, interaction, getPlayer) {
        const value = interaction.options.getString('équipement');

        const con = client.connection;
        const player = await getPlayer(con, interaction.user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const craftEmbed = new MessageEmbed()
            .setColor(interaction.member.displayColor)
            .setTitle("CRAFT")
            .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
            .addField("Description", `${lang.craft.description}`)
            .addField("Documentation", `${lang.craft.doc} ${Emotes.tools} [ pickaxe ]\n${Emotes.weapons} [ sword / shield ]\n${Emotes.armors} [ head / shoulders / chest / wrists ]\n${Emotes.armors} [hands / waist / legs / feet ]\n${Emotes.bag} [ ring / dungeon_amulet / torch ]`)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });

        switch (value) {
            case "pickaxe":
                return manageCraft(con, player, interaction, "tools", "pickaxe", Emotes.chests.Tools.rune_pickaxe);
            case "sword":
                return manageCraft(con, player, interaction, "tools", "sword", Emotes.chests.Weapons.rune_sword);
            case "shield":
                return manageCraft(con, player, interaction, "tools", "shield", Emotes.chests.Weapons.rune_shield);
            case "head":
                return manageCraft(con, player, interaction, "armors", "head", Emotes.chests.Gear.P1.rune_head);
            case "shoulders":
                return manageCraft(con, player, interaction, "armors", "shoulders", Emotes.chests.Gear.P1.rune_shoulders);
            case "chest":
                return manageCraft(con, player, interaction, "armors", "chest", Emotes.chests.Gear.P1.rune_chest);
            case "wrists":
                return manageCraft(con, player, interaction, "armors", "wrists", Emotes.chests.Gear.P1.rune_wrists);
            case "hands":
                return manageCraft(con, player, interaction, "armors", "hands", Emotes.chests.Gear.P2.rune_hands);
            case "waist":
                return manageCraft(con, player, interaction, "armors", "waist", Emotes.chests.Gear.P2.rune_waist);
            case "legs":
                return manageCraft(con, player, interaction, "armors", "legs", Emotes.chests.Gear.P2.rune_legs);
            case "feet":
                return manageCraft(con, player, interaction, "armors", "feet", Emotes.chests.Gear.P2.rune_feet);
            case "dungeon_amulet":
                return manageCraft(con, player, interaction, "objects", "dungeon_amulet", Emotes.dungeon_amulet);
            case "ring":
                return manageCraft(con, player, interaction, "objects", "ring", Emotes.ring);
            case "torch":
                return manageCraft(con, player, interaction, "objects", "torch", Emotes.torch);
            case "info":
                return interaction.reply({ embeds: [craftEmbed] });
        }
    }
}