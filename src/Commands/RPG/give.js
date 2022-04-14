const manageGive = require('../../../functions/manageGive'),
Default          = require('../../../utils/default.json');

module.exports = {
    name: 'give',
    description: 'Pour donner des objets',
    options: [
        {
            name: 'membre',
            description: 'Sélectionnez un utilisateur.',
            type: 'USER',
            required: true
        },
        {
            name: 'ressource',
            description: 'Choississez la ressource à donner',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'Stone',
                    value: 'stone'
                },
                {
                    name: 'Coal',
                    value: 'coal'
                },
                {
                    name: 'Copper',
                    value: 'copper'
                },
                {
                    name: 'Iron',
                    value: 'iron'
                },
                {
                    name: 'Gold',
                    value: 'gold'
                },
                {
                    name: 'Malachite',
                    value: 'malachite'
                }
            ]
        },
        {
            name: 'montant',
            description: 'Saississez le montant désiré.',
            type: 'NUMBER',
            required: true
        }
    ],
    async execute(client, interaction, getPlayer, getUser) {
        const { user, options } = interaction;
        const target = options.getUser('membre');
        const choice = options.getString('ressource');
        const amount = options.getNumber('montant');

        const con = client.connection;
        const player = await getPlayer(con, interaction.user.id);
        const targetDB = await getUser(con, target.id);
        if (!player) return interaction.reply(Default.notRegistered);
        if (!targetDB) return interaction.reply(Default.targetNotRegistered);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        if (target.id === user.id) return interaction.reply(`${lang.give.giveToSelf}`);
        if (amount > 0) {
            manageGive(con, player, target, targetDB, interaction, choice, amount);
        } else {
            return interaction.reply(lang.give.specifyAmount);
        } 
    }
}