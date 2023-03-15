const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data: {
        name: "explore",
        description: "To explore unknown lands",
        descriptionLocalizations: {
            fr: "Pour explorer des contrées inconnues"
        },
        options: [
            {
                name: "visit",
                description: "To visit the current area",
                descriptionLocalizations: {
                    fr: "Pour visiter la zone actuelle"
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "torch",
                        description: "The amount of torches to spend to explore",
                        descriptionLocalizations: {
                            fr: "La quantité de torches à dépenser pour explorer"
                        },
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ]
            },
            {
                name: "travel",
                description: "To travel to another area (Must have the dungeon amulet)",
                descriptionLocalizations: {
                    fr: "Pour se rendre dans une autre zone (il faut avoir l'amulette du donjon)"
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "area",
                        description: "To change the area to exlore",
                        descriptionLocalizations: {
                            fr: "Pour changer de zone à explorer"
                        },
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: "Abandoned Mine", name_localizations: { "fr": "Mine abandonnée" }, value: "0" },
                            { name: "Ancient Ruins", name_localizations: { "fr": "Ruines Antiques" }, value: "1" },
                            { name: "Underground Village", name_localizations: { "fr": "Village Souterrain" }, value: "2" },
                            { name: "Catacombs", name_localizations: { "fr": "Catacombes" }, value: "3" },
                            { name: "Treasure room", name_localizations: { "fr": "Salle aux trésors" }, value: "4" }
                        ]
                    }
                ]
            }
        ]
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const zone = interaction.options.getString("area");
        const torchQuantity = interaction.options.getNumber("torch");

        const con = client.connection;
        const player = await client.getPlayer(con, interaction.user.id);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const chest = ["chest_d", "chest_c", "chest_b", "chest_a", "chest_s"];
        const array = [`${lang.explore.zone_0}`, `${lang.explore.zone_1}`, `${lang.explore.zone_2}`, `${lang.explore.zone_3}`, `${lang.explore.zone_4}`]
        const rarity = [`${lang.chest.rarity_d}`, `${lang.chest.rarity_c}`, `${lang.chest.rarity_b}`, `${lang.chest.rarity_a}`, `${lang.chest.rarity_s}`]
        const reactZones = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣'];
        
        if (zone) {
            if (zone == player.ress.zone) return interaction.reply(`${client.translate(player.data.lang, "explore.alreadyInZone", array[player.ress.zone])}`);
            if (player.items.dungeon_amulet <= (zone - 1)) return interaction.reply(`${lang.explore.switchError}`);

            con.query(`UPDATE ress SET zone = ${zone} WHERE userid = ${interaction.user.id}`);

            return interaction.reply({ content: `Vous entrez dans ► **${array[zone]}**.` });
        } else if (torchQuantity) {
            if (player.ress.torch < torchQuantity) return interaction.reply(`${lang.explore.notEnoughDungeonStone} (${player.ress.torch}/${torchQuantity} ${Emotes.torch})`);
            if (torchQuantity > 0) {
                if (player.items.dungeon_amulet <= 0) return interaction.reply({ content: `${client.translate(player.data.lang, "explore.switchError")}`});
                con.query(`UPDATE ress SET ${chest[player.ress.zone]} = ${player.ress[chest[player.ress.zone]] + Number(torchQuantity)}, torch = ${player.ress.torch - (torchQuantity)} WHERE userid = ${interaction.user.id}`)
        
                return interaction.reply(`${client.Emotes.torch_explore} ${client.translate(player.data.lang, "explore.explored", `**${array[player.ress.zone]}**`, `**${torchQuantity}**`, `**${rarity[player.ress.zone]}**`)}\n*${lang.explore.switch}*.`)
            }
        } else {
            const embed = new EmbedBuilder()
                .setColor(interaction.member.displayColor)
                .setTitle("EXPLORE")
                .setDescription(`${lang.explore.description}`)
                .addFields(
                    { name: `${lang.explore.currentLocation}`, value: `${array[player.ress.zone]}/${reactZones[player.ress.zone]}`},
                    { name: `${lang.explore.torch}`, value: `${client.Emotes.torch} ${player.ress.torch}` }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL()});

            return interaction.reply({ embeds: [embed] });
        }
    }
}