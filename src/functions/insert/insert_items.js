const Default = require('../../utils/default.json');

module.exports = async function insert_items(client, con, player, interaction, databaselogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO items (
            uuid, userid, ring, dungeon_amulet,
            pickaxe, sword, shield,
            head, shoulders, chest, wrists,
            hands, waist, legs, feet
            ) VALUES (
            '${Default.player.uuid}', '${userid}', '${Default.player.ring}','${Default.player.dungeon_amulet}',
            '${Default.player.pickaxe}', '${Default.player.sword}', '${Default.player.shield}',
            '${Default.player.head}', '${Default.player.shoulders}', '${Default.player.chest}', '${Default.player.wrists}',
            '${Default.player.hands}', '${Default.player.waist}', '${Default.player.legs}', '${Default.player.feet}'
        )`, async function(err) {
            if (err) return databaselogs.send(`🔴 table **items** > An error occurred :\n**${err}**`);
            databaselogs.send(`🟢 table **items** : **${userid}** aka **${interaction.user.tag}**.`);
        }); //end query items
    }
} 