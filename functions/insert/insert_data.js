const Default = require('../../utils/default.json');

module.exports = async function insert_data(client, con, player, interaction, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO data (
            uuid, username, userid,
            lang, ban,
            money, manaCooldown, hpCooldown, energyCooldown, lastActivity,
            HP, MANA, ATK, DEF, power,
            lastHR, lastDaily, lastRep
            ) VALUES (
            '${Default.player.uuid}', '${interaction.user.tag}', '${userid}',
            '${Default.player.lang}', '${Default.player.ban}',
            '${Default.player.money}', '${Default.player.manaCooldown}', '${Default.player.hpCooldown}', '${Default.player.energyCooldown}', '${Default.player.lastActivity}',
            '${Default.player.HP}', '${Default.player.MANA}', '${Default.player.ATK}', '${Default.player.DEF}', '${Default.player.power}',
            '${Default.player.lastHR}', '${Default.player.lastDaily}', '${Default.player.lastRep}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **data** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **data** : **${userid}** aka **${interaction.user.tag}**.`);
        }); //end query data
    }
} 