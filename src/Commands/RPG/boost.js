const { getPremiumDuration } = require("../../../utils/u");

module.exports = {
    name: 'boost',
    description: 'Récupèrez des récompenses en boostant le serveur',
    async execute(client, interaction) {
        const userid = interaction.user.id;

        const booster = interaction.guild.members.cache.get(userid);

        const b = getPremiumDuration(booster);
        let text = booster.premiumSinceTimestamp ? `${b.years}y ${b.months}m ${b.days}j ${b.hours}h ${b.minutes}m ${b.seconds}s` : "None"

        const embed = new MessageEmbed()
        .setTitle("Boost Informations")
        .setColor("#f47fff")
        .setDescription(`Boost depuis : **${text}**`)
        return interaction.reply({ embeds: [embed] });
    }
}