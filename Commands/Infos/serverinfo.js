const { CommandInteraction, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: "serverinfo",
    description: "Affiche les informations actuelles du serveur",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
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
        let presenceString = `🟢 En ligne : ${online}\n🌙 Absents : ${idle}\n⛔ Ne pas déranger : ${dnd}\n⭕ Hors ligne : ${offline}`


        // verification levels for "guild.verificationLevel" field
        const verifLevels = {
            "NONE": "Aucun",
            "LOW": "Faible",
            "MEDIUM": "Moyen",
            "HIGH": "(╯°□°）╯︵  ┻━┻",
            "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
        };

        const premiumTier = {
            "NONE": "0",
            "TIER_1": "1",
            "TIER_2": "2",
            "TIER_3": "3"
        };

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField("📝 Nom", guild.name)
            .addField("👑 Preaupryaitères", `${guildOwner}`)
            .addField("🚀 Boosts", `**Niveau** : ${premiumTier[guild.premiumTier]} | ${guild.premiumSubscriptionCount} boosts`, true)
            .addField("✅ Niveau de vérification", verifLevels[guild.verificationLevel], true)
            .addField("🕒 Date de création", `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`, true)
            .addField("👥 Status de membre", `${presenceString}`)
            .addField("🤖", `**Bots** : ${guild.members.cache.filter((member) => member.user.bot === true).size.toString()}`, true)
            .addField("📜", `**Rôles** : ${guild.roles.cache.filter((role) => role.name != "@everyone").size.toString()}`, true)
            .addField("☺", `**Nombre d'emojis** : ${guild.emojis.cache.size.toString()}`, true)
            .addField("📂", `**Catégories** : ${channelCache.filter((channel) => channel.type === "GUILD_CATEGORY").size.toString()}`, true)
            .addField("💬", `**Salons textuels** : ${channelCache.filter((channel) => channel.type === "GUILD_TEXT").size.toString()}`, true)
            .addField("📣", `**Salons vocaux** : ${channelCache.filter((channel) => channel.type === "GUILD_VOICE").size.toString()}`, true)
            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL({ dynamic: true }) })
            .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}