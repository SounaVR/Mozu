require('moment-duration-format');
const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "botinfo",
    description: "Affiche les informations à propos du bot",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const uptime = moment.duration(client.uptime).format("DD [days], HH [hrs], mm [mins], ss [secs]");
        const developer = client.users.cache.find(user => user.id === "436310611748454401");
        const boticon = client.user.avatarURL();
        const embed = new MessageEmbed()
            .setAuthor({ name: client.user.username, iconURL: boticon })
            .setColor("GREEN")
            .setThumbnail(boticon)
            .addField("⚒ Développeur", developer.tag)
    
            .addField("🕒 Temps allumé", uptime, true)
            .addField("💻 JS Runtime", "Node.js", true)
            .addField("🌐 Library NodeJS", "discord.js", true)
    
            .addField("🧠 Mémoire utilisée", Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + " Mb", true)
            .addField("🏠 Serveurs", client.guilds.cache.size.toString(), true)
            .addField("👥 Utilisateurs", client.users.cache.size.toString(), true)
    
            .addField("📎 Mon lien", "[Clique pas](https://media.discordapp.net/attachments/706350683766390854/845538726162989076/3237789807_1_3_brmovBmI.png)", true)
            .addField("🗓 Date de création", `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, true)
    
            .setFooter({ text: client.user.username, iconURL:client.user.avatarURL() })
            .setTimestamp();
    
        interaction.reply({ embeds: [embed] })
    }
}