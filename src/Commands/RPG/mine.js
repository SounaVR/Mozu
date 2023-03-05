const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { nFormatter } = require('../../../utils/u');
const Emotes    = require('../../../utils/emotes.json'),
    Default   = require('../../../utils/default.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mine")
        .setDescription("To mine resources")
        .setDescriptionLocalizations({
            fr: "Pour miner des ressources"
        })
        .addStringOption(option =>
            option.setName("energyamount")
                .setDescription("Amount of energy to spent")
                .setDescriptionLocalizations({
                    fr: "Montant d'énergie à dépenser"
                })
                .setRequired(false)
            ),
    async execute(client, interaction) {
        const { user, member, options } = interaction;
        const amount = options.getString('energyamount');

        const con = client.connection;
        const player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const Items = require(`../../../utils/Items/${player.data.lang}.json`);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);
        const maxEnergy = Items.objects.ring[player.items.ring].energy;
        const power = player.data.power;

        // all/a | [numbers] | nothing = 1 energy per command
        let manaAmount = 'all'.startsWith(amount) ? player.ress.energy : (!isNaN(amount) && amount > 0 ? amount : 1);
        if (manaAmount > player.ress.energy) return interaction.reply(`${lang.mine.notEnoughEnergy}`);

        let Stone  = 0,
        Coal      = 0,
        Copper    = 0,
        Iron      = 0,
        Gold      = 0,
        Malachite = 0;
        // Ressources drop
        for (let i = 0; i < manaAmount; i++) {
            Stone     += (Math.ceil(Math.random() * 70)) + power;                               // Pioche level 0 (mains nues)
            Coal      += (Math.ceil(Math.random() * 50)) + power;                               // Pioche level 0 (mains nues)
            Copper    += player.items.pickaxe > 0 ? (Math.ceil(Math.random() * 45)) + power : 0 // Pioche level 1 (pioche en pierre)
            Iron      += player.items.pickaxe > 1 ? (Math.ceil(Math.random() * 30)) + power : 0 // Pioche level 2 (pioche en cuivre)
            Gold      += player.items.pickaxe > 2 ? (Math.ceil(Math.random() * 15)) + power : 0 // Pioche level 3 (pioche en fer)
            Malachite += player.items.pickaxe > 3 ? (Math.ceil(Math.random() * 5)) + power : 0  // Pioche level 4 (pioche en or)
        }

        let ressLoot = [];
        if (Stone)      ressLoot.push(`+ ${nFormatter(Stone)} ${Emotes.stone}`);
        if (Coal)       ressLoot.push(`+ ${nFormatter(Coal)} ${Emotes.coal}`);
        if (Copper)     ressLoot.push(`+ ${nFormatter(Copper)} ${Emotes.copper}`);
        if (Iron)       ressLoot.push(`+ ${nFormatter(Iron)} ${Emotes.iron}`);
        if (Gold)       ressLoot.push(`+ ${nFormatter(Gold)} ${Emotes.gold}`);
        if (Malachite)  ressLoot.push(`+ ${nFormatter(Malachite)} ${Emotes.malachite}`);

        let pickaxe = Items.tools.pickaxe[player.items.pickaxe];

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
            .setColor(member.displayColor)
            .setThumbnail("https://equity.guru/wp-content/uploads/2018/01/blockchain2.gif")
            .addFields(
                { name: lang.mine.title, value: ressLoot.join("\n") }, //⚡ ${lang.mine.usedEnergy.replace("%s", manaAmount)}\n
                { name: lang.mine.infos, value: `⚡ ${lang.mine.remainingEnergy.replace("%s", player.ress.energy-manaAmount + "/" + maxEnergy)}\n${Emotes.chests.Tools.rune_pickaxe} ${pickaxe.name}\n💪 ${lang.mine.power.replace("%s", player.data.power)}` }
            );//\n${lang.inventory.level}: ${player.items.pickaxe}\n${lang.inventory.enchant}: ${player.enchant.ench_pickaxe}`)

        interaction.reply({ embeds: [embed] });

        con.query(`UPDATE ress SET energy = energy - ${manaAmount}, stone = stone + ${Stone}, coal = coal + ${Coal}, copper = copper + ${Copper}, iron = iron + ${Iron}, gold = gold + ${Gold}, malachite = malachite + ${Malachite} WHERE userid = ${user.id}`);
    }
}