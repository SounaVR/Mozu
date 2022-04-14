const { MessageEmbed } = require('discord.js');
const manageProspecting = require('../../../functions/manageProspecting');
const Emotes = require('../../../utils/emotes.json'),
Default = require('../../../utils/default.json');

module.exports = {
    name: 'prospect',
    description: 'Cherche des gemmes précieuses dans 150 000 minerais. Cela les détruira.',
    options: [
        {
            name: 'minerai',
            description: 'Choississez le minerai à prospecter.',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'Info',
                    value: 'info'
                },
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
            description: '⚠️ 150k minerais seront supprimés ! ⚠️ Saissisez le nombre de gemmes à récupérer avec subtilité.',
            type: 'NUMBER',
            required: false
        }
    ],
    async execute(client, interaction, getPlayer) {
        const { user, member, options } = interaction;
        const ore = options.getString('minerai');
        const amount = options.getNumber('montant');

        const con = client.connection;
        const player = await getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const prospectEmbed = new MessageEmbed()
            .setColor(member.displayColor)
            .setTitle(`${lang.prospect.title}`)
            .addField("Description", `${lang.prospect.description.replace("%s", '/')}`)
            .addField("Documentation", `${lang.prospect.doc}150k ${Emotes.ressource} = 1 ${Emotes.gem}\n\n${Emotes.stone} => ${Emotes.sapphire} +1 Power\n${Emotes.coal} => ${Emotes.amber} -1 sec on energy cooldown\n${Emotes.copper} => ${Emotes.citrine} +1 Mana Max\n${Emotes.iron} => ${Emotes.ruby} +1 HP Max\n${Emotes.gold} => ${Emotes.jade} +1 ATK\n${Emotes.malachite} => ${Emotes.amethyst} +1 DEF`)
            .setTimestamp()
            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

        if (ore === 'info') return interaction.reply({ embeds: [prospectEmbed] });
        if (!amount) return interaction.reply(lang.prospect.specifyAmount);

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