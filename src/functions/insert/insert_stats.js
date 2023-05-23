const Default = require('../../utils/default.json');

module.exports = async function insert_stats(client, con, player, interaction, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO stats (
            uuid, userid, cmd, HR, daily, rep
            ) VALUES (
            '${Default.player.uuid}', '${userid}', '${Default.player.cmd}', '${Default.player.HR}', '${Default.player.daily}', '${Default.player.rep}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **stats** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **stats** : **${userid}** aka **${interaction.user.tag}**.`);
        }); //end query stats
    }
} 