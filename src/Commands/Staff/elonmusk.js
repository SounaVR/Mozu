const Default = require("../../../utils/default.json");

module.exports = {
    name: 'elonmusk',
    description: '🕵️',
    options: [
        {
            name: 'user',
            description: 'L\'utilisateur à modifier.',
            type: 'USER',
            required: true
        },
        {
            name: 'action',
            description: 'Définir ou ajouter.',
            type: 'STRING',
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
            description: 'La table à modifier.',
            type: 'STRING',
            required: true,
            choices: ['data', 'ress', 'items', 'enchant', 'prospect', 'slots', 'stats'].map(r => ({name: r.toUpperCase(), value: r}))
        },
        {
            name: 'colonne',
            description: 'La colonne à modifier.',
            type: 'STRING',
            required: true
        },
        {
            name: 'valeur',
            description: 'La valeur à ajouter.',
            type: 'NUMBER',
            required: true
        }
    ],
    async execute(client, interaction) {
        const { user, options } = interaction;
        if (user.id !== "436310611748454401") return interaction.reply("🕵️");
        const target = options.getUser('user');

        const con = client.connection;
        const player = await client.getPlayer(con, target.id);
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