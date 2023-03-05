const { getPremiumDuration } = require("../../../utils/u");
const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("boost")
        .setDescription("Collect rewards by boosting the server")
        .setDescriptionLocalizations({
            fr: "Récupèrez des récompenses en boostant le serveur"
        }),
    async execute(client, interaction) {
        const userid = interaction.user.id;

        const booster = interaction.guild.members.cache.get(userid);

        const b = getPremiumDuration(booster);
        let text = booster.premiumSinceTimestamp ? `${b.years}y ${b.months}m ${b.days}j ${b.hours}h ${b.minutes}m ${b.seconds}s` : "None"

        const embed = new EmbedBuilder()
            .setTitle("Boost Informations")
            .setColor([244, 127, 255])
            .setDescription(`Boost depuis : **${text}**`)
        return interaction.reply({ embeds: [embed] });
    }
}