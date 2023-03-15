const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js'),
    manageEnchant = require('../../functions/manageEnchant');

module.exports = {
    data: {
        name: "enchant",
        description: "To enchant your stuff",
        descriptionLocalizations: {
            fr: "Pour enchanter votre équipement"
        },
        options: [
            {
                name: "gear",
                description: "Choose what you want to enchant",
                descriptionLocalizations: {
                    fr: "Choisissez ce que vous voulez enchanter"
                },
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: 'Info', value: 'info' },
                    { name: 'Pioche', value: 'pickaxe' },
                    { name: 'Épée', value: 'sword' },
                    { name: 'Bouclier', value: 'shield' },
                    { name: 'Tête', value: 'head' },
                    { name: 'Épaules', value: 'shoulders' },
                    { name: 'Torse', value: 'chest' },
                    { name: 'Poignets', value: 'wrists' },
                    { name: 'Mains', value: 'hands' },
                    { name: 'Ceinture', value: 'waist' },
                    { name: 'Jambes', value: 'legs' },
                    { name: 'Pieds', value: 'feet' }
                ],
                required: true
            }
        ]
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const value = interaction.options.getString('gear');

        const con = client.connection;
        const player = await client.getPlayer(con, interaction.user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const enchantEmbed = new EmbedBuilder()
            .setColor(interaction.member.displayColor)
            .setTitle("ENCHANT")
            .setThumbnail("https://media.discordapp.net/attachments/691992473999769623/796006868212383755/EnchantedDiamondSwordNew.gif")
            .addFields(
                { name: "Description", value: `${lang.enchant.description}` },
                { name: "Documentation", value: `${lang.enchant.doc} ${client.Emotes.tools} [ pickaxe ]\n${client.Emotes.weapons} [ sword / shield ]\n ${client.Emotes.armors} [ head / shoulders / chest / wrists ]\n${client.Emotes.armors} [ hands / waist / legs / feet ]` }
            )
            .setTimestamp()
            .setFooter({ text:`${interaction.user.username}`, iconURL: client.user.avatarURL() });

        switch (value) {
            case "pickaxe":
                return manageEnchant(client, con, player, interaction, "tools", "pickaxe", "ench_pickaxe");
            case "sword":
                return manageEnchant(client, con, player, interaction, "tools", "sword", "ench_sword");
            case "shield":
                return manageEnchant(client, con, player, interaction, "tools", "shield", "ench_shield");
            case "head":
                return manageEnchant(client, con, player, interaction, "armors", "head", "ench_head");
            case "shoulders":
                return manageEnchant(client, con, player, interaction, "armors", "shoulders", "ench_shoulders");
            case "chest":
                return manageEnchant(client, con, player, interaction, "armors", "chest", "ench_chest");
            case "wrists":
                return manageEnchant(client, con, player, interaction, "armors", "wrists", "ench_wrists");
            case "hands":
                return manageEnchant(client, con, player, interaction, "armors", "hands", "ench_hands");
            case "waist":
                return manageEnchant(client, con, player, interaction, "armors", "waist", "ench_waist");
            case "legs":
                return manageEnchant(client, con, player, interaction, "armors", "legs", "ench_legs");
            case "feet":
                return manageEnchant(client, con, player, interaction, "armors", "feet", "ench_feet");
            case "info":
                return interaction.reply({ embeds: [enchantEmbed] });
        }
    }
}