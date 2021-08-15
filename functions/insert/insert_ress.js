const Default = require('../../utils/default.json');

module.exports = async function insert_ress(client, con, player, message, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO ress (
            uuid, userid, energy,
            stone, coal, copper, iron, gold, malachite
            ) VALUES (
            '${Default.player.uuid}', '${message.author.id}', '${Default.player.energy}',
            '${Default.mine.stone}', '${Default.mine.coal}', '${Default.mine.copper}', '${Default.mine.iron}', '${Default.mine.gold}', '${Default.mine.malachite}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **ress** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **ress** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM ress`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE ress SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
                con.query(`UPDATE data SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query ress
    }
}