const { EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    data: {
        name: "botinfo",
        description: "Displays information about the bot",
        descriptionLocalizations: {
            fr: "Affiche des informations à propos du bot"
        }
    },
    async execute(client, interaction) {
        const uptime = dayjs.duration(client.uptime).format("DD [days], HH [hrs], mm [mins], ss [secs]");
        const developer = client.users.cache.find(user => user.id === "436310611748454401");
        const boticon = client.user.avatarURL();
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: boticon })
            .setColor("Green")
            .setThumbnail(boticon)
            .addFields(
                { name: "⚒ Developer", value: developer.username },

                { name: "🕒 Uptime", value: uptime, inline: true },
                { name: "💻 JS Runtime", value: "Node.js", inline: true },
                { name: "🌐 NodeJS Library", value: "discord.js", inline: true },

                { name: "🧠 Used Memory", value: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + " Mb", inline: true },
                { name: "🏠 Servers", value: client.guilds.cache.size.toString(), inline: true },
                { name: "👥 Users", value: client.users.cache.size.toString(), inline: true },

                { name: "📎 My link", value: "[Clique pas](https://media.discordapp.net/attachments/706350683766390854/845538726162989076/3237789807_1_3_brmovBmI.png)", inline: true },
                { name: "🗓 Creation Date", value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })
    }
}