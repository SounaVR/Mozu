const Default = require('../../utils/default.json');

module.exports = async function insert_idle(con, player, interaction, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO idle (
            uuid, userid, factory, husbandry, builder
            ) VALUES (
            '${Default.player.uuid}', '${userid}', '${Default.player.idle.factory}', '${Default.player.idle.husbandry}', '${Default.player.idle.builder}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **idle** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **idle** : **${userid}** aka **${interaction.user.username}**.`);
        }); //end query idle
    }
} 