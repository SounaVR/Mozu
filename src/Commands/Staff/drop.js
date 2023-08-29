const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: {
        name: "drop",
        description: "Delete a player from the database",
        descriptionLocalizations: {
            fr: "Supprime un joueur de la base de données"
        },
        default_member_permissions: (1 << 30),
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

        const tables = ["data", "enchant", "idle", "items", "prospect", "ress", "slots", "stats"];
        tables.forEach(async element => {
            await client.query(`DELETE FROM ${element} WHERE userid = ${target.id}`);
        });

        await interaction.reply(`${target}/${target.id} has been DESTROYED :boom:.`);
    }
}