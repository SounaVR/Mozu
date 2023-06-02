const { EmbedBuilder } = require('discord.js');
const Player = require('../../Classes/Player');
const dayjs = require('dayjs');

module.exports = {
    data: {
        name: "inv",
        description: "Displays your inventory",
        descriptionLocalizations: {
            fr: "Affiche votre inventaire"
        },

    },
    async execute(client, interaction) {
        let player = await client.getPlayer(interaction.user.id);
        const Items = require(`../../utils/Items/${player.data.lang}.json`);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);

        const maxEnergy = Items.objects.ring[player.items.ring].energy;
        const energyCooldown = player.data.energyCooldown;
        const hpCooldown = player.data.hpCooldown;

        const embed1 = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(interaction.member.displayColor)
            .setFooter({ text: `Page 1/5` })
            .addFields(
                { name: `⭐ Mana`, value: `${player.data.MANA}/50`, inline: true },
                { name: `❤️ HP [+1/${dayjs.duration(hpCooldown).format("s")}s]`, value: `${player.data.HP}/${Player.getMaxHP(player)}`, inline: true },
                { name: `⚡ ${lang.inventory.energy.replace("%s", `[+1/${dayjs.duration(energyCooldown).format("s")}s]`)}`, value: `${player.ress.energy || 0}/${maxEnergy}`, inline: true },
                { name: `📊 ${lang.inventory.stats}:`, value: `${client.Emotes.ATK} ATK: ${player.data.ATK}\n${client.Emotes.DEF} DEF: ${player.data.DEF}\n${client.Emotes.chests.Tools.rune_pickaxe} Power : ${player.data.power}`, inline: true },
                { name: `Autres:`, value: `${client.Emotes.cash} Balance: ${client.nFormatter(player.data.money)}\n${client.Emotes.rep} Reputations : ${player.stats.rep}`, inline: true }
            )

        let txt = [],
            txt2 = [],
            txt3 = [],
            txt4 = [],
            txt5 = [],
            txt6 = [],
            txt7 = [];

        for (const ressource in client.Default.pickaxe.R1) {
            txt.push(`${client.Emotes[ressource]} ${lang.inventory[ressource]}: ${client.nFormatter(player.ress[ressource])}`);
        }
        for (const ressource in client.Default.pickaxe.R2) {
            txt2.push(`${client.Emotes[ressource]} ${lang.inventory[ressource]}: ${client.nFormatter(player.ress[ressource])}`);
        }
        for (const runes in client.Default.runes.Weapons) {
            txt3.push(`${client.Emotes.chests.Weapons[runes]} ${client.nFormatter(player.ress[runes])}`)
        }
        for (const runes in client.Default.runes.Tools) {
            txt4.push(`${client.Emotes.chests.Tools[runes]} ${client.nFormatter(player.ress[runes])}`)
        }
        for (const runes in client.Default.runes.Gear.P1) {
            txt5.push(`${client.Emotes.chests.Gear.P1[runes]} ${client.nFormatter(player.ress[runes])}`)
        }
        for (const runes in client.Default.runes.Gear.P2) {
            txt6.push(`${client.Emotes.chests.Gear.P2[runes]} ${client.nFormatter(player.ress[runes])}`)
        }
        for (const chest in client.Emotes.explore) {
            txt7.push(`${client.Emotes.explore[chest]} ${player.ress[chest]}`)
        }

        const embed2 = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(interaction.member.displayColor)
            .setFooter({ text: `Page 2/5` })
            .addFields(
                { name: `${client.Emotes.ressource} ${lang.inventory.ressources} (1)`, value: txt.join('\n'), inline: true },
                { name: `${client.Emotes.ressource} ${lang.inventory.ressources} (2)`, value: txt2.join('\n'), inline: true },
                { name: `${client.Emotes.gem} ${lang.inventory.gems}`, value: `${client.Emotes.sapphire} ${player.prospect.sapphire} ${client.Emotes.amber} ${player.prospect.amber} ${client.Emotes.citrine} ${player.prospect.citrine} ${client.Emotes.ruby} ${player.prospect.ruby} ${client.Emotes.jade} ${player.prospect.jade} ${client.Emotes.amethyst} ${player.prospect.amethyst}` }
            )

        const embed3 = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(interaction.member.displayColor)
            .setFooter({ text: `Page 3/5` })
            .addFields(
                { name: `${client.Emotes.rune} ${lang.inventory.runes}`, value: `${txt3.join(" ")}\n${txt4.join(" ")}\n${txt5.join(" ")}\n${txt6.join(" ")}` },
                { name: `${client.Emotes.bag} ${lang.inventory.yourObjects}`, value: `${client.Emotes.torch} ${player.ress.torch}` },
                { name: `${client.Emotes.open_chest} ${lang.inventory.chests}`, value: txt7.join(" ") }
            )

        const gear = ["head", "shoulders", "chest", "wrists", "hands", "waist", "legs", "feet"];
        const weapons = ["sword", "shield"];

        let pickaxe = Items.tools.pickaxe[player.items.pickaxe];

        const embed4 = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(interaction.member.displayColor)
            .setFooter({ text: `Page 4/5` }) 

        weapons.forEach(element => {
            let part = Items.tools[element][player.items[element]];
            let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]

            if (enchantmentLevel) embed4.addFields({ name: `${client.Emotes.chests.Weapons[`rune_${element}`]} ${lang.inventory[element]}:`, value: `${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`rune_${element}`]}]`, inline: true })
            else embed4.addFields({ name: `${client.Emotes.chests.Weapons[`rune_${element}`]} ${lang.inventory[element]}:`, value: `${part.name}\n${lang.inventory.level}: ${player.items[element]}`, inline: true })
        });

        let enchantmentLevel = player.enchant.ench_pickaxe > 0 ? player.enchant.ench_pickaxe + Number(0) : player.enchant.ench_pickaxe
        if (enchantmentLevel) embed4.addFields({ name: `${client.Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, value: `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}\n[${lang.inventory.enchant} ${player.enchant.ench_pickaxe}]`, inline: true })
        else embed4.addFields({ name: `${client.Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, value: `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}`, inline: true })

        gear.forEach(element => {
            let slot1;
            let slot2;
            let slot3;
            const [slot_a, slot_b, slot_c] = Player.getGems(player.slots[element]);

            if (slot_a <= 0) slot1 = `${client.Emotes.emptySocket}`;
            else slot1 = `${client.Emotes.gems[slot_a-1]}`;
            if (slot_b <= 0) slot2 = `${client.Emotes.emptySocket}`;
            else slot2 = `${client.Emotes.gems[slot_b-1]}`;
            if (slot_c <= 0) slot3 = `${client.Emotes.emptySocket}`;
            else slot3 = `${client.Emotes.gems[slot_c-1]}`;

            let part = Items.armors[element][player.items[element]];
            let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]

            if (enchantmentLevel) embed4.addFields({ name: `${client.Emotes.enchant[`rune_${element}`]} ${lang.inventory[element]}:`, value: `${slot1 + "" + slot2 + "" + slot3}\n${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`ench_${element}`]}]`, inline: true })
            else embed4.addFields({ name: `${client.Emotes.enchant[`rune_${element}`]} ${lang.inventory[element]}:`, value: `${slot1 + "" + slot2 + "" + slot3}\n${part.name}\n${lang.inventory.level}: ${player.items[element]}`, inline: true })
        });

        let dungeon_amulet = Items.objects.dungeon_amulet[player.items.dungeon_amulet];
        let ring = Items.objects.ring[player.items.ring];

        const embed5 = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(interaction.member.displayColor)
            .setFooter({ text: `Page 5/5` })
            .addFields(
                { name: `${client.Emotes.dungeon_amulet} ${lang.inventory.dungeon_amulet}:`, value: `${dungeon_amulet.name}\n${lang.inventory.level}: ${player.items.dungeon_amulet}`, inline: true },
                { name: `${client.Emotes.ring} ${lang.inventory.ring}:`, value: `${ring.name}\n${lang.inventory.level}: ${player.items.ring}`, inline: true }
            )

        const pages = [
            embed1,
            embed2,
            embed3,
            embed4,
            embed5
        ];

        client.buttonPages(interaction, pages);
    }
}