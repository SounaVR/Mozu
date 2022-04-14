const manageChest = require('../../../functions/manageChest');
const Default     = require('../../../utils/default.json');

module.exports = {
    name: 'chest',
    description: 'Ouvre des coffres pour obtenir des runes d\'enchantements.',
    options: [
        {
            name: 'rareté',
            description: 'Sélectionnez la rareté du coffre que vous voulez ouvrir.',
            type: 'STRING',
            required: true,
            choices: ['s','a','b','c','d'].map(r => ({name: r.toUpperCase(), value: r}))
        },
        {
            name: 'nombre',
            description: 'Tapez le nombre de coffres que vous voulez ouvrir.',
            type: 'NUMBER',
            required: true
        }
    ],
    async execute(client, interaction) {
        const rarity = interaction.options.getString('rareté');
        const number = interaction.options.getNumber('nombre');

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
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        manageChest(client, con, player, interaction, number, `chest_${rarity}`, `${lang.chest[`rarity_${rarity}`]}`, ...chests[rarity]);
    }
}