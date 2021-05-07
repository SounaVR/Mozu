const Default = require('../../utils/default.json');

module.exports = async function insert_enchant(client, con, player, message, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO enchant (
            uuid, userid,
            ench_pickaxe, ench_sword, ench_shield,
            ench_head, ench_shoulders, ench_chest, ench_wrists,
            ench_hands, ench_waist, ench_legs, ench_feet
            ) VALUES (
            '${Default.player.uuid}', '${message.author.id}',
            '${Default.player.ench_pickaxe}', '${Default.player.ench_sword}', '${Default.player.ench_shield}',
            '${Default.player.ench_head}', '${Default.player.ench_shoulders}', '${Default.player.ench_chest}', '${Default.player.ench_wrists}',
            '${Default.player.ench_hands}', '${Default.player.ench_waist}', '${Default.player.ench_legs}', '${Default.player.ench_feet}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **enchant** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **enchant** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM enchant`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE enchant SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query enchant
    }
}