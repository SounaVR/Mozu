const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: {
        name: 'idle',
        description: 'Idling system',
        descriptionLocalizations: {
            fr: 'Système afk'
        },
        options: [
            {
                name: 'factory',
                description: 'Build and upgrade a factory that can farm for you',
                descriptionLocalizations: {
                    fr: 'Construisez et améliorez une usine capable de farmer pour vous'
                },
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'info',
                        description: 'Displays informations about your factory',
                        descriptionLocalizations: {
                            fr: 'Affiche des informations à propos de votre usine'
                        },
                        type: ApplicationCommandOptionType.Subcommand
                    },
                    {
                        name: 'upgrade',
                        description: 'Upgrade your factory',
                        descriptionLocalizations: {
                            fr: 'Améliorez votre usine'
                        },
                        type: ApplicationCommandOptionType.Subcommand
                    }
                ]
            },
            {
                name: 'husbandry',
                description: 'Breed your pets and upgrade them for more stats',
                descriptionLocalizations: {
                    fr: 'Élever vos familiers et améliorez les pour avoir plus de stats'
                },
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'info',
                        description: 'Displays informations about your husbandry',
                        descriptionLocalizations: {
                            fr: 'Affiche des informations à propos de votre élevage'
                        },
                        type: ApplicationCommandOptionType.Subcommand
                    },
                    {
                        name: 'upgrade',
                        description: 'Upgrade your husbandry',
                        descriptionLocalizations: {
                            fr: 'Améliorez votre élevage'
                        },
                        type: ApplicationCommandOptionType.Subcommand
                    }
                ]
            },
            {
                name: 'builder',
                description: 'Create your own machine that crafts for you',
                descriptionLocalizations: {
                    fr: 'Créez votre machine capable de crafter pour vous'
                },
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'info',
                        description: 'Displays informations about your builder',
                        descriptionLocalizations: {
                            fr: 'Affiche des informations à propos de votre constructeur'
                        },
                        type: ApplicationCommandOptionType.Subcommand
                    },
                    {
                        name: 'upgrade',
                        description: 'Upgrade your builder',
                        descriptionLocalizations: {
                            fr: 'Améliorez votre constructeur'
                        },
                        type: ApplicationCommandOptionType.Subcommand
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
        const { options, user } = interaction;
        const subCommandGroup = options.getSubcommandGroup();
        const subCommand = options.getSubcommand();

        switch (subCommandGroup) {
            case 'factory':
                switch (subCommand) {
                    case 'info':
                        interaction.reply({ content: "WIP 🐒", ephemeral: true });
                        break;
                
                    case 'upgrade':
                        interaction.reply({ content: "WIP 🐒", ephemeral: true });
                        break;
                }
                break;

            case 'husbandry':
                switch (subCommand) {
                    case 'info':
                        interaction.reply({ content: "WIP 🐒", ephemeral: true });
                        break;
                
                    case 'upgrade':
                        interaction.reply({ content: "WIP 🐒", ephemeral: true });
                        break;
                }
                break;

            case 'builder':
                switch (subCommand) {
                    case 'info':
                        interaction.reply({ content: "WIP 🐒", ephemeral: true });
                        break;
                
                    case 'upgrade':
                        interaction.reply({ content: "WIP 🐒", ephemeral: true });
                        break;
                }
                break;
        }
    }
}