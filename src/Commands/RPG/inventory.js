require("moment-duration-format");
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { nFormatter, buttonPages } = require('../../../utils/u.js');
const moment         = require('moment'),
    Default          = require('../../../utils/default.json'),
    Emotes           = require('../../../utils/emotes.json');

module.exports = {
    data: new SlashCommandBuilder()
		.setName("inv")
		.setDescription("Displays your inventory")
		.setDescriptionLocalizations({
			fr: "Affiche votre inventaire"
		}),
    async execute(client, interaction) {
        const { user, member } = interaction;
        let con = client.connection
        let player = await client.getPlayer(con, user.id);
        if (!player) return interaction.reply(Default.notRegistered);
        const Items = require(`../../../utils/Items/${player.data.lang}.json`);
        const lang = require(`../../../utils/Text/${player.data.lang}.json`);
        const maxEnergy = Items.objects.ring[player.items.ring].energy;
        const maxHP = 50;
        const energyCooldown = player.data.energyCooldown;
        const hpCooldown = player.data.hpCooldown;

        const embed1 = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
            .setColor(member.displayColor)
            .setFooter({ text: `Page 1/5` })
            .addFields(
                { name: `⭐ Mana`, value: `${player.data.MANA}/50`, inline: true },
                { name: `❤️ HP [+1/${moment.duration(hpCooldown).format("s")}s]`, value: `${player.data.HP}/${maxHP}`, inline: true },
                { name: `⚡ ${lang.inventory.energy.replace("%s", `[+1/${moment.duration(energyCooldown).format("s")}s]`)}`, value: `${player.ress.energy || 0}/${maxEnergy}`, inline: true },
                { name: `📊 ${lang.inventory.stats}:`, value: `${Emotes.ATK} ATK: ${player.data.ATK}\n${Emotes.DEF} DEF: ${player.data.DEF}\n${Emotes.chests.Tools.rune_pickaxe} Power : ${player.data.power}`, inline: true },
                { name: `Autres:`, value: `${Emotes.cash} Balance: ${nFormatter(player.data.money)}\n${Emotes.rep} Reputations : ${player.stats.rep}`, inline: true }
            )

        let txt = [],
            txt2 = [],
            txt3 = [],
            txt4 = [],
            txt5 = [],
            txt6 = [],
            txt7 = [];

        for (const ressource in Default.pickaxe.R1) {
            txt.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.ress[ressource])}`);
        }
        for (const ressource in Default.pickaxe.R2) {
            txt2.push(`${Emotes[ressource]} ${lang.inventory[ressource]}: ${nFormatter(player.ress[ressource])}`);
        }
        for (const runes in Default.runes.Weapons) {
            txt3.push(`${Emotes.chests.Weapons[runes]} ${nFormatter(player.ress[runes])}`)
        }
        for (const runes in Default.runes.Tools) {
            txt4.push(`${Emotes.chests.Tools[runes]} ${nFormatter(player.ress[runes])}`)
        }
        for (const runes in Default.runes.Gear.P1) {
            txt5.push(`${Emotes.chests.Gear.P1[runes]} ${nFormatter(player.ress[runes])}`)
        }
        for (const runes in Default.runes.Gear.P2) {
            txt6.push(`${Emotes.chests.Gear.P2[runes]} ${nFormatter(player.ress[runes])}`)
        }
        for (const chest in Emotes.explore) {
            txt7.push(`${Emotes.explore[chest]} ${player.ress[chest]}`)
        }

        const embed2 = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
            .setColor(member.displayColor)
            .setFooter({ text: `Page 2/5` })
            .addFields(
                { name: `${Emotes.ressource} ${lang.inventory.ressources} (1)`, value: txt.join('\n'), inline: true },
                { name: `${Emotes.ressource} ${lang.inventory.ressources} (2)`, value: txt2.join('\n'), inline: true },
                { name: `${Emotes.gem} ${lang.inventory.gems}`, value: `${Emotes.sapphire} ${player.prospect.sapphire} ${Emotes.amber} ${player.prospect.amber} ${Emotes.citrine} ${player.prospect.citrine} ${Emotes.ruby} ${player.prospect.ruby} ${Emotes.jade} ${player.prospect.jade} ${Emotes.amethyst} ${player.prospect.amethyst}` }
            )

        const embed3 = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
            .setColor(member.displayColor)
            .setFooter({ text: `Page 3/5` })
            .addFields(
                { name: `${Emotes.rune} ${lang.inventory.runes}`, value: `${txt3.join(" ")}\n${txt4.join(" ")}\n${txt5.join(" ")}\n${txt6.join(" ")}` },
                { name: `${Emotes.bag} ${lang.inventory.yourObjects}`, value: `${Emotes.torch} ${player.ress.torch}` },
                { name: `${Emotes.open_chest} ${lang.inventory.chests}`, value: txt7.join(" ") }
            )
     
        const gear = ["head", "shoulders", "chest", "wrists", "hands", "waist", "legs", "feet"];
        const weapons = ["sword", "shield"];
    
        let pickaxe = Items.tools.pickaxe[player.items.pickaxe];

        const embed4 = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
            .setColor(member.displayColor)
            .setFooter({ text: `Page 4/5` }) 
       
        weapons.forEach(element => {
            let part = Items.tools[element][player.items[element]];
            let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]
    
            if (enchantmentLevel) embed4.addFields({ name: `${Emotes.chests.Weapons[`rune_${element}`]} ${lang.inventory[element]}:`, value: `${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`rune_${element}`]}]`, inline: true })
            else embed4.addFields({ name: `${Emotes.chests.Weapons[`rune_${element}`]} ${lang.inventory[element]}:`, value: `${part.name}\n${lang.inventory.level}: ${player.items[element]}`, inline: true })
        });

        let enchantmentLevel = player.enchant.ench_pickaxe > 0 ? player.enchant.ench_pickaxe + Number(0) : player.enchant.ench_pickaxe
        if (enchantmentLevel) embed4.addFields({ name: `${Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, value: `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}\n[${lang.inventory.enchant} ${player.enchant.ench_pickaxe}]`, inline: true })
        else embed4.addFields({ name: `${Emotes.chests.Tools.rune_pickaxe} ${lang.inventory.pickaxe}:`, value: `${pickaxe.name}\n${lang.inventory.level}: ${player.items.pickaxe}`, inline: true })
        
        gear.forEach(element => {
            // var slot1;
            // var slot2;
            // var slot3;
            // const slot_a = player.slots[`slot_a_${element}`]-1;
            // const slot_b = player.slots[`slot_b_${element}`]-1;
            // const slot_c = player.slots[`slot_c_${element}`]-1;
    
            // if (slot_a <= -1) slot1 = `${Emotes.emptySocket}`;
            // else slot1 = `${Emotes.gems[slot_a]}`;
            // if (slot_b <= -1) slot2 = `${Emotes.emptySocket}`;
            // else slot2 = `${Emotes.gems[slot_b]}`;
            // if (slot_c <= -1) slot3 = `${Emotes.emptySocket}`;
            // else slot3 = `${Emotes.gems[slot_c]}`;
    
            // let part = Items.armors[element][player.items[element]];
            // let enchantmentLevel = player.enchant[`ench_${element}`] > 0 ? player.enchant[`ench_${element}`] + Number(0) : player.enchant[`ench_${element}`]
     
            // if (enchantmentLevel) embed4.addField(`${Emotes.enchant[`rune_${element}`]} ${lang.inventory[element]}:`, `${slot1 + "" + slot2 + "" + slot3}\n${part.name}\n${lang.inventory.level}: ${player.items[element]}\n[${lang.inventory.enchant} ${player.enchant[`ench_${element}`]}]`, true)
            // else embed4.addField(`${Emotes.enchant[`rune_${element}`]} ${lang.inventory[element]}:`, `${slot1 + "" + slot2 + "" + slot3}\n${part.name}\n${lang.inventory.level}: ${player.items[element]}`, true)
        });

        let dungeon_amulet = Items.objects.dungeon_amulet[player.items.dungeon_amulet];
        let ring = Items.objects.ring[player.items.ring];

        const embed5 = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
            .setColor(member.displayColor)
            .setFooter({ text: `Page 5/5` })
            .addFields(
                { name: `${Emotes.dungeon_amulet} ${lang.inventory.dungeon_amulet}:`, value: `${dungeon_amulet.name}\n${lang.inventory.level}: ${player.items.dungeon_amulet}`, inline: true },
                { name: `${Emotes.ring} ${lang.inventory.ring}:`, value: `${ring.name}\n${lang.inventory.level}: ${player.items.ring}`, inline: true }
            )

        const pages = [
            embed1,
            embed2,
            embed3,
            embed4,
            embed5
        ];

        buttonPages(interaction, pages);
    }
}