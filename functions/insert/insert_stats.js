const Default = require('../../utils/default.json');

module.exports = async function insert_stats(client, con, player, message, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO stats (
            uuid, userid, cmd
            ) VALUES (
            '${Default.player.uuid}', '${message.author.id}', '${Default.player.cmd}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **stats** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **stats** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM stats`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE stats SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query stats
    }
}