const { ApplicationCommandOptionType } = require("discord.js");
const Default = require("../../utils/default.json");
const tables = ['data', 'ress', 'items', 'enchant', 'prospect', 'slots', 'stats'];

module.exports = {
    data: {
        name: 'elonmusk',
        description: '🕵️',
        default_member_permissions: (1 << 30),
        options: [
            {
                name: 'user',
                description: 'L\'utilisateur à modifier',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'action',
                description: 'Définir ou ajouter',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'set',
                        value: 'set'
                    },
                    {
                        name: 'add',
                        value: 'add'
                    }
                ]
            },
            {
                name: 'table',
                description: 'La table à modifier',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: tables.map(r => ({name: r.toUpperCase(), value: r}))
            },
            {
                name: 'colonne',
                description: 'La colonne à modifier',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'valeur',
                description: 'La valeur à ajouter',
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const { user, options } = interaction;
        if (user.id !== "436310611748454401") return interaction.reply({ text: "🕵️", ephemeral: true });
        const target = options.getUser('user');

        const con = client.connection;
        const player = await client.getPlayer(target.id);
        if (!player) return interaction.reply(Default.targetNotRegistered);

        switch (options.getString('action')) {
            case 'set':
                con.query(`UPDATE ${options.getString('table')} SET ${options.getString('colonne')} = ${options.getNumber('valeur')} WHERE userid = ${target.id}`);
                break;
            case 'add':
                con.query(`UPDATE ${options.getString('table')} SET ${options.getString('colonne')} = ${player[options.getString('table')][options.getString('colonne')] + Number(options.getNumber('valeur'))} WHERE userid = ${target.id}`);
                break;
        }
        return interaction.reply("✅");
    }
}