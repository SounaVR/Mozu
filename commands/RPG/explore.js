const Discord = require("discord.js"),
    Emotes    = require("../../utils/emotes.json"),
    Default   = require("../../utils/default.json");

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;
    const chest   = ["chest_d", "chest_c", "chest_b", "chest_a", "chest_s"]
    const array = [`${lang.explore.zone_0}`, `${lang.explore.zone_1}`, `${lang.explore.zone_2}`, `${lang.explore.zone_3}`, `${lang.explore.zone_4}`]
    const rarity = [`${lang.chest.rarity_d}`, `${lang.chest.rarity_c}`, `${lang.chest.rarity_b}`, `${lang.chest.rarity_a}`, `${lang.chest.rarity_s}`]
    const reactZones = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣'];

    if (args[0] == "switch") {
        const zones = await message.channel.send(`${lang.explore.selectZone.replace("%u", `<@${userid}>`)}`);

        await zones.react(reactZones[0]);
        await zones.react(reactZones[1]);
        await zones.react(reactZones[2]);
        await zones.react(reactZones[3]);
        await zones.react(reactZones[4]);

        const filterZones = (reaction, user) => reactZones.includes(reaction.emoji.name) && user.id === message.author.id;

        const collectorZones = zones.createReactionCollector(filterZones, { time: 30000, max: 1 });

        collectorZones.on('collect', r => {
            zones.delete();
            switch (r.emoji.name) {
                case "0️⃣":
                    con.query(`UPDATE ress SET zone = 0 WHERE userid = ${userid}`);
                    message.reply(" vous entrez dans ► **Mine Abandonnée**.");
                    break;
                case "1️⃣":
                    if (player.items.dungeon_amulet <= 0) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE ress SET zone = 1 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Ruines Antiques**.");
                    break;
                case "2️⃣":
                    if (player.items.dungeon_amulet <= 1) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE ress SET zone = 2 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Village Souterrain**.");
                    break;
                case "3️⃣":
                    if (player.items.dungeon_amulet <= 2) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE ress SET zone = 3 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Catacombes**.");
                    break;
                case "4️⃣":
                    if (player.items.dungeon_amulet <= 3) return message.reply(`${lang.explore.switchError}`);
                    con.query(`UPDATE ress SET zone = 4 WHERE userid = ${userid}`);
                    message.reply("vous entrez dans ► **Salle aux trésors**.");
                    break;
            }

            collectorZones.stop();
        });

        collectorZones.on('end', () => {
            zones.reactions.removeAll();
        });
    } else if (args[0] > 0) {
        if (player.ress.torch < args[0]) return message.reply(`${lang.explore.notEnoughDungeonStone.replace("%s", client.config.prefix)} (${player.ress.torch}/${args[0]} ${Emotes.torch})`);
        if (player.items.dungeon_amulet <= 0) return message.reply(`${lang.explore.switchError}`);
        con.query(`UPDATE ress SET ${chest[player.ress.zone]} = ${player.ress[chest[player.ress.zone]] + Number(args[0])}, torch = ${player.ress.torch - (args[0])} WHERE userid = ${userid}`)

        return message.channel.send(`${Emotes.torch_explore} <@${userid}> ${lang.explore.explored.replace("%s", `**${array[player.ress.zone]}**`).replace("%m", `**${args[0]}**`).replace("%r", `**${rarity[player.ress.zone]}**`)}\n*${lang.explore.switch.replace("%s", client.config.prefix)}*.`)
    } else if (!args[0]) {
        const embed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("EXPLORE")
        .setDescription(`${lang.explore.description.replace("%s", client.config.prefix).replace("%p", client.config.prefix)}`)
        .addField(`${lang.explore.currentLocation}`, `${array[player.ress.zone]}/${reactZones[player.ress.zone]}`)
        .addField(`${lang.explore.torch}`, `${Emotes.torch} ${player.ress.torch}`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

        return message.channel.send(embed);
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
