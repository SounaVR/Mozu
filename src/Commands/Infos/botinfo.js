require('moment-duration-format');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription("Affiche les informations à propos du bot"),
    async execute(client, interaction) {
        const uptime = moment.duration(client.uptime).format("DD [days], HH [hrs], mm [mins], ss [secs]");
        const developer = client.users.cache.find(user => user.id === "436310611748454401");
        const boticon = client.user.avatarURL();
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: boticon })
            .setColor("Green")
            .setThumbnail(boticon)
            .addFields(
                { name: "⚒ Développeur", value: developer.tag },

                { name: "🕒 Temps allumé", value: uptime, inline: true },
                { name: "💻 JS Runtime", value: "Node.js", inline: true },
                { name: "🌐 Library NodeJS", value: "discord.js", inline: true },

                { name: "🧠 Mémoire utilisée", value: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + " Mb", inline: true },
                { name: "🏠 Serveurs", value: client.guilds.cache.size.toString(), inline: true },
                { name: "👥 Utilisateurs", value: client.users.cache.size.toString(), inline: true },

                { name: "📎 Mon lien", value: "[Clique pas](https://media.discordapp.net/attachments/706350683766390854/845538726162989076/3237789807_1_3_brmovBmI.png)", inline: true },
                { name: "🗓 Date de création", value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true }
            )
                
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
            .setTimestamp()
    
        await interaction.reply({ embeds: [embed] })
    }
}