const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: {
        name: "serverinfo",
        description: "Displays the current server information",
        descriptionLocalizations: {
            fr: "Affiche les informations actuelles du serveur"
        }
    },
    async execute(client, interaction) {
        //variables
        const guild = interaction.guild;
        await guild.members.fetch();
        const guildOwner = await guild.fetchOwner();
        const channelCache = guild.channels.cache;
        const presenceCache = guild.presences.cache;

        // presence calculation
        const totalMembers = guild.memberCount;
        const online = presenceCache.filter((presence) => presence.status === "online").size;
        const idle = presenceCache.filter((presence) => presence.status === "idle").size;
        const dnd = presenceCache.filter((presence) => presence.status === "dnd").size;
        const offline = totalMembers - (online + idle + dnd);
        let presenceString = `🟢 Online : ${online}\n🌙 Idle : ${idle}\n⛔ Do not disturb : ${dnd}\n⭕ Invisible : ${offline}`

        // verification levels for "guild.verificationLevel" field
        const verifLevels = {
            "0": "None",
            "1": "Low",
            "2": "Medium",
            "3": "(╯°□°）╯︵  ┻━┻",
            "4": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
        };

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: "📝 Name", value: guild.name, inline: true },
                { name: "🔢 Guild ID", value: guild.id, inline: true },

                { name: "👑 Owner", value: `${guildOwner}` },

                { name: "🚀 Boosts", value: `${guild.premiumSubscriptionCount} boosts`, inline: true },
                { name: "✅ Verification Level", value: `${verifLevels[guild.verificationLevel]}`, inline: true },
                { name: "🕒 Creation Date", value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`, inline: true },

                { name: "👥 Members status", value: `${presenceString}` },

                { name: "🤖", value: `**Bots** : ${guild.members.cache.filter((bot) => bot.user.bot).size}`, inline: true },
                { name: "📜", value: `**Roles** : ${guild.roles.cache.filter((role) => role.name != "@everyone").size}`, inline: true },
                { name: "☺", value: `**Emotes number** : ${guild.emojis.cache.size}`, inline: true },

                { name: "📂", value: `**Category** : ${channelCache.filter((channel) => channel.type === ChannelType.GuildCategory).size}`, inline: true },
                { name: "💬", value: `**Text channels** : ${channelCache.filter((channel) => channel.type === ChannelType.GuildText).size}`, inline: true },
                { name: "📣", value: `**Voice channels** : ${channelCache.filter((channel) => channel.type === ChannelType.GuildVoice).size}`, inline: true }
            )

            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
            .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}