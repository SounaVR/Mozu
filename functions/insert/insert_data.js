const Default = require('../../utils/default.json');

module.exports = async function insert_data(client, con, player, message, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO data (
            uuid, username, userid, lang, ban, money, lastActivity,
            HP, MANA, ATK, DEF, power,
            HR, lastHR, daily, lastDaily, rep, lastRep
            ) VALUES (
            '${Default.player.uuid}', '${message.author.username}#${message.author.discriminator}', '${message.author.id}', '${Default.player.lang}', '${Default.player.ban}',
            '${Default.player.money}', '${Default.player.lastActivity}',
            '${Default.player.HP}', '${Default.player.MANA}', '${Default.player.ATK}', '${Default.player.DEF}', '${Default.player.power}',
            '${Default.player.HR}', '${Default.player.lastHR}', '${Default.player.daily}', '${Default.player.lastDaily}', '${Default.player.rep}', '${Default.player.lastRep}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **data** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **data** : **${message.author.id}** aka **${message.author.tag}**.`);
        }); //end query data
    }
}