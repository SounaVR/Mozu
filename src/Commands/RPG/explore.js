const { MessageEmbed } = require("discord.js"),
    { translate } = require("../../../utils/u"),
    Emotes    = require("../../../utils/emotes.json"),
    Default   = require("../../../utils/default.json");

module.exports = {
    name: 'explore',
    description: 'Pour explorer des contrées inconnues',
    options: [
        {
            name: 'zone',
            description: 'Pour changer de zone.',
            type: 'STRING',
            choices: [
                {
                    name: 'Mine abandonnée',
                    value: '0'
                },
                {
                    name: 'Ruines Antiques',
                    value: '1'
                },
                {
                    name: 'Village Souterrain',
                    value: '2'
                },
                {
                    name: 'Catacombes',
                    value: '3'
                },
                {
                    name: 'Salle aux trésors',
                    value: '4'
                }
            ]
        },
        {
            name: 'explore',
            description: 'La quantité de torches à dépenser pour explorer.',
            type: 'NUMBER'
        }
    ],
    async execute(client, interaction) {
        const { options, user } = interaction;
        const zone = options.getString("zone");
        const torchQuantity = options.getNumber("explore");

        const con = client.connection;
        const player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const chest = ["chest_d", "chest_c", "chest_b", "chest_a", "chest_s"];
        const array = [`${lang.explore.zone_0}`, `${lang.explore.zone_1}`, `${lang.explore.zone_2}`, `${lang.explore.zone_3}`, `${lang.explore.zone_4}`]
        const rarity = [`${lang.chest.rarity_d}`, `${lang.chest.rarity_c}`, `${lang.chest.rarity_b}`, `${lang.chest.rarity_a}`, `${lang.chest.rarity_s}`]
        const reactZones = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣'];

        if (zone) {
            if (zone == player.ress.zone) return interaction.reply(`${translate(player.data.lang, "explore.alreadyInZone", array[player.ress.zone])}`);
            if (player.items.dungeon_amulet <= (zone - 1)) return interaction.reply(`${lang.explore.switchError}`);

            con.query(`UPDATE ress SET zone = ${zone} WHERE userid = ${user.id}`);

            return interaction.reply({ content: `Vous entrez dans ► **${array[zone]}**.` });
        } else if (torchQuantity) {
            if (player.ress.torch < torchQuantity) return interaction.reply(`${lang.explore.notEnoughDungeonStone} (${player.ress.torch}/${torchQuantity} ${Emotes.torch})`);
            if (torchQuantity > 0) {
                if (player.items.dungeon_amulet <= 0) return interaction.reply({ content: `${translate(player.data.lang, "explore.switchError")}`});
                con.query(`UPDATE ress SET ${chest[player.ress.zone]} = ${player.ress[chest[player.ress.zone]] + Number(torchQuantity)}, torch = ${player.ress.torch - (torchQuantity)} WHERE userid = ${user.id}`)
        
                return interaction.reply(`${Emotes.torch_explore} ${translate(player.data.lang, "explore.explored", `**${array[player.ress.zone]}**`, `**${torchQuantity}**`, `**${rarity[player.ress.zone]}**`)}\n*${lang.explore.switch}*.`)
            }
        } else {
            const embed = new MessageEmbed()
                .setColor(interaction.member.displayColor)
                .setTitle("EXPLORE")
                .setDescription(`${lang.explore.description}`)
                .addField(`${lang.explore.currentLocation}`, `${array[player.ress.zone]}/${reactZones[player.ress.zone]}`)
                .addField(`${lang.explore.torch}`, `${Emotes.torch} ${player.ress.torch}`)
                .setTimestamp()
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL()});

            return interaction.reply({ embeds: [embed] });
        }
    }
}