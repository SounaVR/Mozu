const { ApplicationCommandOptionType } = require('discord.js');
const manageChest = require('../../functions/manageChest');

module.exports = {
    data: {
        name: 'chest',
        description: 'Open chests to obtain enchantment runes',
        descriptionLocalizations: {
            fr: 'Ouvre des coffres pour obtenir des runes d\'enchantements'
        },
        options: [
            {
                name: 'rarity',
                description: 'Select the rarity of the chest you want to open',
                descriptionLocalizations: {
                    fr: 'Sélectionnez la rareté du coffre que vous voulez ouvrir'
                },
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: 'S', value: 's' },
                    { name: 'A', value: 'a' },
                    { name: 'B', value: 'b' },
                    { name: 'C', value: 'c' },
                    { name: 'D', value: 'd' }
                ],
                required: true
            },
            {
                name: 'quantity',
                description: 'The desired number of chest you want to open',
                descriptionLocalizations: {
                    fr: 'Le nombre de coffres que vous souhaitez ouvrir'
                },
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
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
        const player = await client.getPlayer(interaction.user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        manageChest(client, player, interaction, number, `chest_${rarity}`, `${lang.chest[`rarity_${rarity}`]}`, ...chests[rarity]);
    }
}