const { EmbedBuilder, SlashCommandBuilder } = require("discord.js"),
    { translate } = require("../../../utils/u"),
    Emotes    = require("../../../utils/emotes.json"),
    Default   = require("../../../utils/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("explore")
        .setDescription("To explore unknown lands")
        .setDescriptionLocalizations({
            fr: "Pour explorer des contrées inconnues"
        })
        .addSubcommand(subcommand => 
            subcommand.setName("visit")
            .setDescription("To visit the current area")
            .setDescriptionLocalizations({
                fr: "Pour visiter la zone actuelle"
            })
            .addNumberOption(option => 
                option.setName("torch")
                .setDescription("The amount of torches to spend to explore")
                .setDescriptionLocalizations({
                    fr: "La quantité de torches à dépenser pour explorer"
                })
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("travel")
            .setDescription("To travel to another area (Must have the dungeon amulet)")
            .setDescriptionLocalizations({
                fr: "Pour se rendre dans une autre zone (il faut avoir l'amulette du donjon)"
            })
            .addStringOption(option =>
                option.setName("area")
                .setDescription("To change the area to exlore")
                .setDescriptionLocalizations({
                    fr: "Pour changer de zone à explorer"
                })
                .addChoices(
                    { name: 'Abandoned Mine', name_localizations: { "fr": "Mine abandonnée" }, value: '0' },
                    { name: 'Ancient Ruins', name_localizations: { "fr": "Ruines Antiques" }, value: '1' },
                    { name: 'Underground Village', name_localizations: { "fr": "Village Souterrain" }, value: '2' },
                    { name: 'Catacombs', name_localizations: { "fr": "Catacombes" }, value: '3' },
                    { name: 'Treasure room', name_localizations: { "fr": "Salle aux trésors" }, value: '4' }
                )
            )
        ),
    async execute(client, interaction) {
        const { options, user } = interaction;
        const zone = options.getString("area");
        const torchQuantity = options.getNumber("torch");

        const con = client.connection;
        const player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);

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
            const embed = new EmbedBuilder()
                .setColor(interaction.member.displayColor)
                .setTitle("EXPLORE")
                .setDescription(`${lang.explore.description}`)
                .addFields(
                    { name: `${lang.explore.currentLocation}`, value: `${array[player.ress.zone]}/${reactZones[player.ress.zone]}`},
                    { name: `${lang.explore.torch}`, value: `${Emotes.torch} ${player.ress.torch}` }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL()});

            return interaction.reply({ embeds: [embed] });
        }
    }
}