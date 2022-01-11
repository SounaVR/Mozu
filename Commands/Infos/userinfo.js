const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "userinfo",
    description: "Affiche des informations sur un utilisateur.",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un utilisateur",
            type: "USER",
            required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        let target = interaction.options.getUser("membre");

        if (!target) target = interaction.user;
        const targetMember = await interaction.guild.members.fetch(target.id);

        const response = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL({ dynamic: true, size: 512 }) })
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 512 }))
            .addField("ID", `${target.id}`, true)
            .addField("Nickname", `${targetMember.nickname != null ? `${targetMember.nickname}` : 'Aucun'}`, true)
            .addField("Roles", `${targetMember.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "Aucun"}`)
            .addField("Membre depuis", `<t:${parseInt(targetMember.joinedTimestamp / 1000)}:R>`, true)
            .addField("Utilisateur Discord depuis", `<t:${parseInt(target.createdTimestamp / 1000)}:R>`, true)

        interaction.reply({ embeds: [response] });
    }
}