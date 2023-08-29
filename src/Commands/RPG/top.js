const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: {
        name: "top",
        description: "Displays differents top 10",
        descriptionLocalizations: {
            fr: "Affiche différents top 10"
        },
        options: [
            {
                name: "top",
                description: "Choose the leaderboard you want to display",
                descriptionLocalizations: {
                    fr: "Choississez le classement que vous désirez afficher"
                },
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: 'money', nameLocalizations: { fr: 'Moula' }, value: 'money'}
                ],
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const choice = interaction.options.getString('top');

        switch (choice) {
            case 'money':
                const top10query = `SELECT username, money FROM data ORDER BY cast(money as SIGNED) DESC LIMIT 10`;

                const results = await client.query(top10query);
                const map1 = results.map((results, position) => `#${position + 1} **${results.username}** : ${results.money}💰`);
                return interaction.reply(`🏆 __**${lang.top.money}**__ 🏆\n\n` + map1.join("\n").replace(/^#1/, "🥇").replace(/^#2/, "🥈").replace(/^#3/, "🥉"));
        }
    }
}