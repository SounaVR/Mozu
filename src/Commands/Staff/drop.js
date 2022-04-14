const Default = require('../../../utils/default.json');

module.exports = {
    name: 'drop',
    description: 'Supprime un joueur de la base de données',
    options: [
        {
            name: 'user',
            description: 'Le joueur à supprimer',
            type: 'USER',
            required: true
        }
    ],
    async execute(client, interaction) {
        const { user, options } = interaction;
        if (user.id !== "436310611748454401") return interaction.reply('❌');
        const target = options.getUser('user');

        const con = client.connection;
        const player = await client.getPlayer(con, target.id);
        if (!player) return interaction.reply(Default.targetNotRegistered);

        await con.query(`DELETE FROM data WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM enchant WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM items WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM prospect WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM ress WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM slots WHERE userid = ${target.id}`);
        await con.query(`DELETE FROM stats WHERE userid = ${target.id}`);

        interaction.reply(`${target}/${target.id} a bien été clear.`);
    }
}