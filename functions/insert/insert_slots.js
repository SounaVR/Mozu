const Default = require('../../utils/default.json');

module.exports = async function insert_slots(client, con, player, message, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO slots (
            uuid, userid,
            slot_a_head, slot_a_shoulders, slot_a_chest, slot_a_wrists,
            slot_a_hands, slot_a_waist, slot_a_legs, slot_a_feet,
            slot_b_head, slot_b_shoulders, slot_b_chest, slot_b_wrists,
            slot_b_hands, slot_b_waist, slot_b_legs, slot_b_feet,
            slot_c_head, slot_c_shoulders, slot_c_chest, slot_c_wrists,
            slot_c_hands, slot_c_waist, slot_c_legs, slot_c_feet
            ) VALUES (
            '${Default.player.uuid}', '${message.author.id}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **slots** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **slots** : **${message.author.id}** aka **${message.author.tag}**.`);
            con.query(`SELECT COUNT(*) AS usersCount FROM ress`, function (err, rows, fields) {
                if (err) throw err;

                con.query(`UPDATE slots SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query slots
    }
}