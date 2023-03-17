const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: {
        name: "drop",
        description: "Delete a player from the database",
        descriptionLocalizations: {
            fr: "Supprime un joueur de la base de données"
        },
        options: [
            {
                name: "user",
                description: "Select an user",
                descriptionLocalizations: "Sélectionnez un utilisateur",
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const { user, options } = interaction;
        if (user.id !== "436310611748454401") return interaction.reply({ content: '❌', ephemeral: true });
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