const { SlashCommandBuilder } = require('discord.js');
const manageChest = require('../../../functions/manageChest');
const Default     = require('../../../utils/default.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chest")
        .setDescription("Open chests to obtain enchantment runes")
        .setDescriptionLocalizations({
            fr: "Ouvre des coffres pour obtenir des runes d\'enchantements"
        })
        .addStringOption(option => 
            option.setName("rarity")
            .setDescription("Select the rarity of the chest you want to open")
            .setDescriptionLocalizations({
                fr: "Sélectionnez la rareté du coffre que vous voulez ouvrir"
            })
            .addChoices(
                { name: 'S', value: 's' },
                { name: 'A', value: 'a' },
                { name: 'B', value: 'b' },
                { name: 'C', value: 'c' },
                { name: 'D', value: 'd' }
            )
            .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName("quantity")
            .setDescription("The desired number of chest you want to open")
            .setDescriptionLocalizations({
                fr: "Le nombre de coffres que vous souhaitez ouvrir"
            })
            .setRequired(true)
        ),
    async execute(client, interaction) {
        const rarity = interaction.options.getString('rarity');
        const number = interaction.options.getNumber('quantity');

        const chests = {
            s: [1000, 1500],
            a: [601, 900],
            b: [201, 600],
            c: [76, 200],
            d: [1, 75]
        }

        const con = client.connection
        const player = await client.getPlayer(con, interaction.user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);

        manageChest(client, con, player, interaction, number, `chest_${rarity}`, `${lang.chest[`rarity_${rarity}`]}`, ...chests[rarity]);
    }
}