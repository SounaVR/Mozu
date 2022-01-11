const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "unban",
    description: "Unban la cible",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "id",
            description: "Sélectionnez un membre à unban",
            type: "NUMBER",
            required: true
        },
        {
            name: "raison",
            description: "Fournissez une raison pour ce unban",
            type: "STRING",
            required: true
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const { guild, options } = interaction;

        const target = options.getNumber("id");
        const reason = options.getString("raison");

        const response = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "Système d'unbans", iconURL: guild.iconURL({ dynamic: true }) })

        await target.unban({ target, reason: reason })
        .then(() => {
            response.setDescription(`${target} a été débanni pour \`${reason}\``)
            interaction.reply({ embeds: [response] });
        }).catch((error) => {
            response.setDescription(`⛔ Ce membre n'est pas banni ! (Impossible de le déban quoi, t'es con ?)`)
            interaction.reply({ embeds: [response] });
        });

        response.setDescription(`Le membre ${target} a été débanni pour \`${reason}\``)
        guild.channels.cache.get("899629148065124434").send({ embeds: [response] });
    }
}