module.exports = {
    data: {
        name: "daily",
        description: "Collect money every day at midnight (UTC+1)",
        descriptionLocalizations: {
            fr: "Collecte de l\'argent tout les jours à 00h00"
        }
    },
    /**
     * @param {import('../../Classes/Client')} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const con = client.connection;
        const player = await client.getPlayer(interaction.user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        switch (player.data.lastDaily) 
        {
            case 0:
                con.query(`UPDATE data SET lastDaily = 1, money = ${player.data.money + Number(300)} WHERE userid = ${interaction.user.id}`);
                con.query(`UPDATE stats SET daily = ${player.stats.daily + Number(1)} WHERE userid = ${interaction.user.id}`);
                interaction.reply(`${lang.daily.done.replace("%s", `300 ${client.Emotes.cash}`)}`);
                break;

            case 1:
                interaction.reply(`${lang.daily.notNow.replace("%s", "00h00")}`);
                break;
        }
    }
}