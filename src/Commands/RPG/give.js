const { ApplicationCommandOptionType } = require('discord.js');
const manageGive = require('../../functions/manageGive'),
Default          = require('../../utils/default.json');

module.exports = {
    data: {
        name: 'give',
        description: 'To give resources',
        descriptionLocalizations: {
            fr: 'Pour donner des ressources'
        },
        options: [
            {
                name: 'member',
                description: 'Select an user',
                descriptionLocalizations: {
                    fr: "Sélectionnez un utilisateur"
                },
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'resource',
                description: 'Choose the resource to give',
                descriptionLocalizations: {
                    fr: 'Choississez la ressource à donner'
                },
                type: ApplicationCommandOptionType.String,
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
                name: 'amount',
                description: 'Enter the desired amount',
                descriptionLocalizations: {
                    fr: 'Saississez le montant désiré'
                },
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const { user, options } = interaction;
        const target = options.getUser('member');
        const choice = options.getString('resource');
        const amount = options.getNumber('amount');

        const con = client.connection;
        const player = await client.getPlayer(user.id);
        const targetDB = await client.getPlayer(target.id);
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