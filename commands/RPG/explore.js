const Default = require("../../utils/default.json"),
Emotes        = require("../../utils/emotes.json");

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;
    const chest   = ["chest_d", "chest_c", "chest_b", "chest_a", "chest_s"]
    const array = [`${lang.explore.zone_0}`, `${lang.explore.zone_1}`, `${lang.explore.zone_2}`, `${lang.explore.zone_3}`, `${lang.explore.zone_4}`]
    const rarity = [`${lang.chest.rarity_d}`, `${lang.chest.rarity_c}`, `${lang.chest.rarity_b}`, `${lang.chest.rarity_a}`, `${lang.chest.rarity_s}`]
    const reactZones = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣'];

    if (args[0] == "switch") {
        const zones = await message.channel.send(`${lang.explore.selectZone}`);

        await zones.react(reactZones[0])
        await zones.react(reactZones[1])
        await zones.react(reactZones[2])
        await zones.react(reactZones[3])
        await zones.react(reactZones[4])

        const filterZones = (reaction, user) => reactZones.includes(reaction.emoji.name) && user.id === message.author.id;

        const collectorZones = zones.createReactionCollector(filterZones, { time: 30000, max: 1 });

        collectorZones.on('collect', r => {
            zones.delete();
            switch (r.emoji.name) {
                case "0️⃣":
                    if (!player.data.dungeon_amulet >= 1) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE data SET zone = 0 WHERE userid = ${userid}`);
                    message.reply(" vous entrez dans ► **Mine Abandonnée**.");
                    break;
                case "1️⃣":
                    if (!player.data.dungeon_amulet >= 2) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE data SET zone = 1 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Ruines Antiques**.");
                    break;
                case "2️⃣":
                    if (!player.data.dungeon_amulet >= 3) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE data SET zone = 2 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Village Souterrain**.");
                    break;
                case "3️⃣":
                    if (!player.data.dungeon_amulet >= 4) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE data SET zone = 3 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Catacombes**.");
                    break;
                case "4️⃣":
                    if (!player.data.dungeon_amulet >= 5) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE data SET zone = 4 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Salle aux trésors**.");
                    break;
            }

            collectorZones.stop();
        })
    } else if (args[0] > 0) {
        if (player.data.dungeon_stone < args[0]) return message.channel.send(`❌ ${lang.explore.notEnoughDungeonStone} (${player.data.dungeon_stone}/${args[0]} ${Emotes.dungeon_stone})`);
        con.query(`UPDATE data SET ${chest[player.data.zone]} = ${player.data[chest[player.data.zone]] + Number(args[0])}, dungeon_stone = ${player.data.dungeon_stone - (args[0])} WHERE userid = ${userid}`)

        return message.reply(`${Emotes.torch} ${lang.explore.explored} **${array[player.data.zone]}** ${lang.explore.haveGot} **${args[0]}** ${lang.explore.chestRarity} **${rarity[player.data.zone]}**.\n*${lang.explore.switch}*.`)
    } else if (!args[0]) {
        return message.reply(`${lang.explore.correctUsage}`)
    }
};

exports.help = {
    name: "explore",
    description_fr: "Pour explorer des contrées inconnues",
    description_en: "To explore unknown lands",
    usage_fr: "<quantité>",
    usage_en: "<quantity>",
    category: "RPG",
    aliases: ['epl', 'pl']
};
