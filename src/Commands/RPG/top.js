const { SlashCommandBuilder } = require('discord.js');
const { getPlayer } = require('../../../utils/u');
const Default = require("../../../utils/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Displays differents top 10")
        .setDescriptionLocalizations({
            fr: "Affiche différents top 10"
        })
        .addStringOption(option =>
            option.setName("top")
                .setDescription("Choose the leaderboard you want to display")
                .setDescriptionLocalizations({
                    fr: "Choississez le classement que vous désirez afficher"
                })
                .setRequired(true)
                .addChoices(
                    { name: 'money', value: 'money'}
                )
            ),
    async execute(client, interaction) {
        const con = client.connection;
        const player = await getPlayer(con, interaction.user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);
        const choice = interaction.options.getString('top');
        
        switch (choice) {
            case 'money':
                const top10query = `SELECT username, money FROM data ORDER BY cast(money as SIGNED) DESC LIMIT 10`;

                const query = querytxt => {
                    return new Promise((resolve, reject) => {
                    con.query(querytxt, (err, results, fields) => {
                        if (err) reject(err);
                        resolve([results, fields]);
                    });
                    });
                };
                const [results, fields] = await query(top10query);
                const map1 = results.map((results, position) => `#${position + 1} **${results.username}** : ${results.money}💰`);

                return interaction.reply("🏆 __**Classement de la moula**__ 🏆\n\n" + map1.join("\n").replace(/^#1/, "🥇").replace(/^#2/, "🥈").replace(/^#3/, "🥉"));
        } 
    }
}