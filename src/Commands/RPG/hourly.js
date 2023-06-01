const ms = require("parse-ms");

module.exports = {
    data: {
        name: "hourly",
        description: "Collect money every hours",
        descriptionLocalizations: {
            fr: "Collecte de l'argent toutes les heures"
        }
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const player = await client.getPlayer(interaction.user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);
        const cooldown = 3600000;
        const energy = Math.ceil(Math.random() * 15)+5;

        if (player.data.lastHR !== null && cooldown - (Date.now() - player.data.lastHR) > 0) {
            const timeObj = ms(cooldown - (Date.now() -  player.data.lastHR));

            return interaction.reply(`${lang.hr.notNow.replace("%s", `**${timeObj.minutes}m${timeObj.seconds}sec**`)} !`);
        }

        client.query(`UPDATE data SET lastHR = ${Date.now()}, money = ${player.data.money + Number(30)} WHERE userid = ${interaction.user.id}`);
        client.query(`UPDATE ress SET energy = ${player.ress.energy + Number(energy)} WHERE userid = ${interaction.user.id}`);
        client.query(`UPDATE stats SET HR = ${player.stats.HR + Number(1)} WHERE userid = ${interaction.user.id}`);

        return interaction.reply(`${client.translate(player.data.lang, 'hr.done', `${energy} ${client.Emotes.energy}`)}`);
    }
}