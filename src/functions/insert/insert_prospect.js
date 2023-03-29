const Default = require('../../utils/default.json');

module.exports = async function insert_prospect(client, con, player, interaction, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO prospect (
            uuid, userid, sapphire, amber,
            citrine, ruby, jade, amethyst
            ) VALUES (
            '${Default.player.uuid}', '${userid}', '${Default.player.sapphire}', '${Default.player.amber}',
            '${Default.player.citrine}', '${Default.player.ruby}', '${Default.player.jade}', '${Default.player.amethyst}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **prospect** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **prospect** : **${userid}** aka **${interaction.user.tag}**.`);
            await con.query(`SELECT COUNT(*) AS usersCount FROM prospect`, async function (err, rows, fields) {
                if (err) throw err;

                await con.query(`UPDATE prospect SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query prospect
    }
} 