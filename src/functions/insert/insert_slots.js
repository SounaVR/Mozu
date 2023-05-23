const Default = require('../../utils/default.json');

module.exports = async function insert_slots(client, con, player, interaction, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO slots (
            uuid, userid,
            head, shoulders, chest, wrists, hands, waist, legs, feet
            ) VALUES (
            '${Default.player.uuid}', '${userid}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}',
            '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}', '${Default.player.slots}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **slots** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **slots** : **${userid}** aka **${interaction.user.tag}**.`);
        }); //end query slots
    }
} 