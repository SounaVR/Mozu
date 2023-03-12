const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const manageProspecting = require('../../../functions/manageProspecting');
const Emotes = require('../../../utils/emotes.json'),
Default = require('../../../utils/default.json');

module.exports = {
    data: {
        name: "prospect",
        description: "Look for precious gems in 150,000 ores. This will destroy them",
        descriptionLocalizations: {
            fr: "Cherche des gemmes précieuses dans 150 000 minerais. Cela les détruira"
        },
        options: [
            {
                name: "ore",
                description: "Choose the ore to prospect",
                descriptionLocalizations: {
                    fr: "Choississez le minerai à prospecter"
                },
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: 'Info', value: 'info' },
                    { name: 'Stone', value: 'stone' },
                    { name: 'Copper', value: 'copper' },
                    { name: 'Iron', value: 'iron' },
                    { name: 'Gold', value: 'gold' },
                    { name: 'Malachite', value: 'malachite' }
                ],
                required: true
            },
            {
                name: "quantity",
                description: "⚠️ 150k ores will be removed! ⚠️ Know the number of gems to recover with subtlety",
                descriptionLocalizations: {
                    fr: "⚠️ 150k minerais seront supprimés ! ⚠️ Saissisez le nombre de gemmes à récupérer avec subtilité"
                },
                type: ApplicationCommandOptionType.Number
            }
        ]
    },
    async execute(client, interaction) {
        const { user, member, options } = interaction;
        const ore = options.getString('ore');
        let amount = options.getNumber('quantity');

        const con = client.connection;
        const player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);

        const prospectEmbed = new EmbedBuilder()
            .setColor(member.displayColor)
            .setTitle(`${lang.prospect.title}`)
            .addFields(
                { name: "Description", value: `${lang.prospect.description.replace("%s", '/')}` },
                { name: "Documentation", value: `${lang.prospect.doc}150k ${Emotes.ressource} = 1 ${Emotes.gem}\n\n${Emotes.stone} => ${Emotes.sapphire} +1 Power\n${Emotes.coal} => ${Emotes.amber} -1 sec on energy cooldown\n${Emotes.copper} => ${Emotes.citrine} +1 Mana Max\n${Emotes.iron} => ${Emotes.ruby} +1 HP Max\n${Emotes.gold} => ${Emotes.jade} +1 ATK\n${Emotes.malachite} => ${Emotes.amethyst} +1 DEF` }    
            )
            .setTimestamp()
            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

        if (ore === 'info') return interaction.reply({ embeds: [prospectEmbed] });
        if (amount <= 0) amount = 1;

        switch (ore) {
            case "stone":
                return manageProspecting(client, con, player, interaction, "stone", amount, "sapphire", "+Power");
            case "coal":
                return manageProspecting(client, con, player, interaction, "coal", amount, "amber", "-energy cooldown");
            case "copper":
                return manageProspecting(client, con, player, interaction, "copper", amount, "citrine", "+Mana Max");
            case "iron":
                return manageProspecting(client, con, player, interaction, "iron", amount, "ruby", "+HP Max");
            case "gold":
                return manageProspecting(client, con, player, interaction, "gold", amount, "jade", "+ATK");
            case "malachite":
                return manageProspecting(client, con, player, interaction, "malachite", amount, "amethyst", "+DEF");
        }
    }
}