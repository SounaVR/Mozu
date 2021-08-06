const { checkDays } = require('../../utils/u.js');
const Discord = require("discord.js"),
    moment    = require("moment");

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

    // region flag object for "guild.region" field
    const region = {
        "brazil": ":flag_br: Brazil",
        "europe": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za: South Africa"
    };

    const embed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addField("📝 Name", guild.name)
        .addField("👑 Owner", `${guild.owner.user.username}#${guild.owner.user.discriminator}`)
        .addField("🏴 Region", region[guild.region], true)
        .addField("🚀 Boosts", `Level: ${guild.premiumTier} | ${guild.premiumSubscriptionCount} boosts`, true)
        .addField("✅ Verification Level", verifLevels[guild.verificationLevel], true)
        .addField("🕒 Created at", `${moment.utc(message.channel.guild.createdAt).format('DD/MM/YYYY')}\n(${checkDays(message.channel.guild.createdAt)})`, true)
        .addField("👥 Member Status", presenceString)
        .addField("🤖 Bots", guild.members.cache.filter((member) => member.user.bot === true).size, true)
        .addField("📜 Roles", guild.roles.cache.filter((role) => role.name != "@everyone").size, true)
        .addField("😊 Emoji Count", guild.emojis.cache.size, true)
        .addField("📁 Categories", channelCache.filter((channel) => channel.type === "category").size, true)
        .addField("💬 Text Channels", channelCache.filter((channel) => channel.type === "text").size, true)
        .addField("📣 Voice Channels", channelCache.filter((channel) => channel.type === "voice").size, true)
        .setFooter(`${client.user.username}`, client.user.avatarURL({ dynamic: true }))
        .setTimestamp();
    message.channel.send({ embed });
};

exports.help = {
    name: "serverinfo",
    description_fr: "Affiche les informations du serveur",
    description_en: "Displays server information",
    category: "Infos",
    aliases: ["si"]
};
