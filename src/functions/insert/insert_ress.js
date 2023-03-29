const Default = require('../../utils/default.json');

module.exports = async function insert_ress(client, con, player, interaction, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO ress (
            uuid, userid, energy, zone, torch, stone, coal, copper, iron, gold, malachite,
            chest_d, chest_c, chest_b, chest_a, chest_s,
            rune_pickaxe, rune_sword, rune_shield, rune_head, rune_shoulders, rune_chest, rune_wrists,
            rune_hands, rune_waist, rune_legs, rune_feet
            ) VALUES (
            '${Default.player.uuid}', '${userid}', '${Default.player.energy}', '${Default.player.zone}', '${Default.player.torch}',
            '${Default.mine.stone}', '${Default.mine.coal}', '${Default.mine.copper}', '${Default.mine.iron}', '${Default.mine.gold}', '${Default.mine.malachite}',
            '${Default.player.chest_d}', '${Default.player.chest_c}', '${Default.player.chest_b}', '${Default.player.chest_a}', '${Default.player.chest_s}',
            '${Default.player.rune_pickaxe}', '${Default.player.rune_sword}', '${Default.player.rune_shield}', '${Default.player.rune_head}', '${Default.player.rune_shoulders}', '${Default.player.rune_chest}', '${Default.player.rune_wrists}',
            '${Default.player.rune_hands}', '${Default.player.rune_waist}', '${Default.player.rune_legs}', '${Default.player.rune_feet}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **ress** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **ress** : **${userid}** aka **${interaction.user.tag}**.`);
            await con.query(`SELECT COUNT(*) AS usersCount FROM ress`, async function (err, rows, fields) {
                if (err) throw err;

                await con.query(`UPDATE ress SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
                await con.query(`UPDATE data SET uuid = ${rows[0].usersCount} WHERE userid = ${userid}`);
            });
        }); //end query ress
    }
} 