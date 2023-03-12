const { getPremiumDuration } = require("../../../utils/u");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: {
        name: "boost",
        description: "Collect rewards by boosting the server",
        descriptionLocalizations: {
            fr: "Récupèrez des récompenses en boostant le serveur"
        }
    },
    async execute(client, interaction) {
        const userid = interaction.user.id;

        const booster = interaction.guild.members.cache.get(userid);

        const b = getPremiumDuration(booster);
        let text = booster.premiumSinceTimestamp ? `${b.years}y ${b.months}m ${b.days}j ${b.hours}h ${b.minutes}m ${b.seconds}s` : "None"

        const embed = new EmbedBuilder()
            .setTitle("Boost Informations")
            .setColor(0xF480FF)
            .setDescription(`Boost depuis : **${text}**`)
        return interaction.reply({ embeds: [embed] });
    }
}