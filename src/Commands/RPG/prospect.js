const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const manageProspecting = require('../../functions/manageProspecting');

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

        const player = await client.getPlayer(user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const prospectEmbed = new EmbedBuilder()
            .setColor(member.displayColor)
            .setTitle(`${lang.prospect.title}`)
            .addFields(
                { name: "Description", value: `${lang.prospect.description.replace("%s", '/')}` },
                { name: "Documentation", value: `${lang.prospect.doc}150k ${client.Emotes.ressource} = 1 ${client.Emotes.gem}\n\n${client.Emotes.stone} => ${client.Emotes.sapphire} +1 Power\n${client.Emotes.coal} => ${client.Emotes.amber} -1 sec on energy cooldown\n${client.Emotes.copper} => ${client.Emotes.citrine} +1 Mana Max\n${client.Emotes.iron} => ${client.Emotes.ruby} +1 HP Max\n${client.Emotes.gold} => ${client.Emotes.jade} +1 ATK\n${client.Emotes.malachite} => ${client.Emotes.amethyst} +1 DEF` }    
            )
            .setTimestamp()
            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

        if (ore === 'info') return interaction.reply({ embeds: [prospectEmbed] });
        if (amount <= 0) amount = 1;

        switch (ore) {
            case "stone":
                return manageProspecting(client, player, interaction, "stone", amount, "sapphire", "+Power");
            case "coal":
                return manageProspecting(client, player, interaction, "coal", amount, "amber", "-energy cooldown");
            case "copper":
                return manageProspecting(client, player, interaction, "copper", amount, "citrine", "+Mana Max");
            case "iron":
                return manageProspecting(client, player, interaction, "iron", amount, "ruby", "+HP Max");
            case "gold":
                return manageProspecting(client, player, interaction, "gold", amount, "jade", "+ATK");
            case "malachite":
                return manageProspecting(client, player, interaction, "malachite", amount, "amethyst", "+DEF");
        }
    }
}