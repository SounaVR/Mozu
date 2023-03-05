const { SlashCommandBuilder } = require('discord.js');
const Default = require('../../../utils/default.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drop')
        .setDescription('Delete a player from the database')
        .setDescriptionLocalizations({
            fr: "Supprime un joueur de la base de données"
        })
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select an user")
                .setDescriptionLocalizations({
                    fr: "Sélectionnez un utilisateur"
                })
                .setRequired(true)
        ),
    async execute(client, interaction) {
        const { user, options } = interaction;
        if (user.id !== "436310611748454401") return interaction.reply('❌');
        const target = options.getUser('user');

        const con = client.connection;

        await con.query(`DELETE FROM data WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM enchant WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM items WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM prospect WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM ress WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM slots WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM stats WHERE userid = ${target.id}`);

        await interaction.reply(`${target}/${target.id} has been DESTROYED :boom:.`);
    }
}