const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Affiche des informations sur un utilisateur.')
        .addUserOption(option =>
            option
                .setName("membre")
                .setDescription("Sélectionnez un utilisateur")
        ),
    async execute(client, interaction) {
        let target = interaction.options.getUser("membre");

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