const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: {
        name: "userinfo",
        description: "Displays information about a user",
        descriptionLocalizations: {
            fr: "Affiche des informations sur un utilisateur"
        },
        options: [
            {
                name: "member",
                description: "Select a member",
                descriptionLocalizations: "Sélectionnez un membre",
                type: ApplicationCommandOptionType.User
            }
        ]
    },
    async execute(client, interaction) {
        let target = interaction.options.getUser("member");

        if (!target) target = interaction.user;
        const targetMember = await interaction.guild.members.fetch(target.id);

        const response = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL({ dynamic: true, size: 512 }) })
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: "ID", value: `${target.id}`, inline: true },
                { name: "Nickname", value: `${targetMember.nickname != null ? `${targetMember.nickname}` : 'None'}`, inline: true },

                { name: "Roles", value: `${targetMember.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"}` },

                { name: "Member since", value: `<t:${parseInt(targetMember.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: "Discord user since", value: `<t:${parseInt(target.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
            .setTimestamp()

        await interaction.reply({ embeds: [response] });
    }
}