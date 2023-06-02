const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js'),
    manageCraft = require('../../functions/manageCraft');

module.exports = {
    data: {
        name: 'craft',
        description: 'To make or improve your current equipment',
        descriptionLocalizations: {
            fr: 'Pour fabriquer ou améliorer votre équipement actuel'
        },
        options: [
            {
                name: 'stuff',
                description: 'Choose what you want to craft',
                descriptionLocalizations: {
                    fr: 'Choisissez ce que vous voulez crafter'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'stuff',
                        description: 'Choose what you want to craft',
                        descriptionLocalizations: {
                            fr: 'Choisissez ce que vous voulez crafter'
                        },
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            { name: 'Info', value: 'info' },
                            { name: 'Pickaxe', nameLocalizations: { fr: 'Pioche' }, value: 'pickaxe' },
                            { name: 'Sword', nameLocalizations: { fr: 'Épée' }, value: 'sword' },
                            { name: 'Shield', nameLocalizations: { fr: 'Bouclier' }, value: 'shield' },
                            { name: 'Head', nameLocalizations: { fr: 'Tête' }, value: 'head' },
                            { name: 'Shoulders', nameLocalizations: { fr: 'Épaules' }, value: 'shoulders' },
                            { name: 'Chest', nameLocalizations: { fr: 'Torse' }, value: 'chest' },
                            { name: 'Wrists', nameLocalizations: { fr: 'Poignets' }, value: 'wrists' },
                            { name: 'Hands', nameLocalizations: { fr: 'Mains' }, value: 'hands' },
                            { name: 'Waist', nameLocalizations: { fr: 'Ceinture' }, value: 'waist' },
                            { name: 'Legs', nameLocalizations: { fr: 'Jambes' }, value: 'legs' },
                            { name: 'Feet', nameLocalizations: { fr: 'Pieds' }, value: 'feet' },
                            { name: 'Dungeon Amulet', nameLocalizations: {fr: 'Amulette de donjon' }, value: 'dungeon_amulet' },
                            { name: 'Ring', nameLocalizations: { fr: 'Anneau' }, value: 'ring' },
                            { name: 'Torch', nameLocalizations: { fr: 'Torche' }, value: 'torch' }
                        ],
                        required: true
                    }
                ]
            },
            {
                name: 'torch',
                description: 'To craft some torches',
                descriptionLocalizations: {
                    fr: 'Pour crafter quelques torches'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'torch',
                        description: 'To craft some torches',
                        descriptionLocalizations: {
                            fr: 'Pour crafter quelques torches'
                        },
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ]
            }
        ]
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const value = interaction.options.getString('stuff');
        const torchAmount = interaction.options.getNumber('torch');

        const player = await client.getPlayer(interaction.user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const craftEmbed = new EmbedBuilder()
            .setColor(interaction.member.displayColor)
            .setTitle("CRAFT")
            .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
            .addFields(
                { name: "Description", value: `${lang.craft.description}` },
                { name: "Documentation", value: `${lang.craft.doc} ${client.Emotes.tools} [ pickaxe ]\n${client.Emotes.weapons} [ sword / shield ]\n${client.Emotes.armors} [ head / shoulders / chest / wrists ]\n${client.Emotes.armors} [hands / waist / legs / feet ]\n${client.Emotes.bag} [ ring / dungeon_amulet / torch ]` }
            )
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });

        if (torchAmount) return manageCraft(client, player, interaction, "objects", "torch", client.Emotes.torch, torchAmount);

        switch (value) {
            case "pickaxe":
                return manageCraft(client, player, interaction, "tools", "pickaxe", client.Emotes.chests.Tools.rune_pickaxe);
            case "sword":
                return manageCraft(client, player, interaction, "tools", "sword", client.Emotes.chests.Weapons.rune_sword);
            case "shield":
                return manageCraft(client, player, interaction, "tools", "shield", client.Emotes.chests.Weapons.rune_shield);
            case "head":
                return manageCraft(client, player, interaction, "armors", "head", client.Emotes.chests.Gear.P1.rune_head);
            case "shoulders":
                return manageCraft(client, player, interaction, "armors", "shoulders", client.Emotes.chests.Gear.P1.rune_shoulders);
            case "chest":
                return manageCraft(client, player, interaction, "armors", "chest", client.Emotes.chests.Gear.P1.rune_chest);
            case "wrists":
                return manageCraft(client, player, interaction, "armors", "wrists", client.Emotes.chests.Gear.P1.rune_wrists);
            case "hands":
                return manageCraft(client, player, interaction, "armors", "hands", client.Emotes.chests.Gear.P2.rune_hands);
            case "waist":
                return manageCraft(client, player, interaction, "armors", "waist", client.Emotes.chests.Gear.P2.rune_waist);
            case "legs":
                return manageCraft(client, player, interaction, "armors", "legs", client.Emotes.chests.Gear.P2.rune_legs);
            case "feet":
                return manageCraft(client, player, interaction, "armors", "feet", client.Emotes.chests.Gear.P2.rune_feet);
            case "dungeon_amulet":
                return manageCraft(client, player, interaction, "objects", "dungeon_amulet", client.Emotes.dungeon_amulet);
            case "ring":
                return manageCraft(client, player, interaction, "objects", "ring", client.Emotes.ring);
            case "info":
                return interaction.reply({ embeds: [craftEmbed] });
        }
    }
}