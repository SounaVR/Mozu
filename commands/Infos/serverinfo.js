const { checkDays } = require('../../utils/u.js');
const Discord = require("discord.js"),
    moment    = require("moment");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 */
exports.run = async (client, message, args, getPlayer, getUser) => {
    //variables
    const guild = message.guild;
    const channelCache = guild.channels.cache;
    const presenceCache = guild.presences.cache;

    // presence calculation
    const online = `🟢 Online : ${presenceCache.filter((presence) => presence.status === "online").size}\n`;
    const idle = `🌙 Idle : ${presenceCache.filter((presence) => presence.status === "idle").size}\n`;
    const dnd = `⛔ Do not disturb : ${presenceCache.filter((presence) => presence.status === "dnd").size}\n`;
    const offline = `⭕ Offline : ${presenceCache.filter((presence) => presence.status === "offline").size}\n`;
    let presenceString = online + idle + dnd + offline;

    // verification levels for "guild.verificationLevel" fied
    const verifLevels = {
        "NONE": "None",
        "LOW": "Low",
        "MEDIUM": "Medium",
        "HIGH": "(╯°□°）╯︵  ┻━┻",
        "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
    };

    // récupérer la liste des membres
    await guild.members.fetch();
    const guildOwner = await guild.fetchOwner();

    const embed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addField("📝 Name", guild.name)
        .addField("👑 Owner", `${guildOwner}`)
        .addField("🚀 Boosts", `Level: ${guild.premiumTier} | ${guild.premiumSubscriptionCount} boosts`, true)
        .addField("✅ Verification Level", verifLevels[guild.verificationLevel], true)
        .addField("🕒 Created at", `${moment.utc(message.channel.guild.createdAt).format('DD/MM/YYYY')}\n(${checkDays(message.channel.guild.createdAt)})`, true)
        .addField("👥 Member Status", presenceString)
        .addField("🤖 Bots", guild.members.cache.filter((member) => member.user.bot === true).size.toString(), true)
        .addField("📜 Roles", guild.roles.cache.filter((role) => role.name != "@everyone").size.toString(), true)
        .addField("😊 Emoji Count", guild.emojis.cache.size.toString(), true)
        .addField("📁 Categories", channelCache.filter((channel) => channel.type === "GUILD_CATEGORY").size.toString(), true)
        .addField("💬 Text Channels", channelCache.filter((channel) => channel.type === "GUILD_TEXT").size.toString(), true)
        .addField("📣 Voice Channels", channelCache.filter((channel) => channel.type === "GUILD_VOICE").size.toString(), true)
        .setFooter(`${client.user.username}`, client.user.avatarURL({ dynamic: true }))
        .setTimestamp();
    message.channel.send({ embeds: [embed] });
};

exports.help = {
    name: "serverinfo",
    description_fr: "Affiche les informations du serveur",
    description_en: "Displays server information",
    category: "Infos",
    aliases: ["si"]
};
