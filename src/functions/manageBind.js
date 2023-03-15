const { EmbedBuilder } = require("discord.js");
const Gems = require("../utils/Items/gems.json");
const Emotes = require("../utils/emotes.json");
const Player = require("../Classes/Player");

module.exports = async function manageBind(con, player, interaction, gem, part, stat, bind, number, slot) {
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const userid = interaction.user.id;

    const obj = Gems[gem][part];

    const key = Object.keys(obj);

    await con.query(`UPDATE prospect SET ${gem} = ${player.prospect[gem] - Number(1)} WHERE userid = ${userid}`);

    let gemNumber = player.slots[part];

    let gems = Player.getGems(gemNumber);

    gems[slot] = number;

    const newGemsNumber = Player.getGemNumber(gems);

    if (stat === "energyCooldown") {
        await con.query(`UPDATE data SET energyCooldown = ${player.data.energyCooldown - Number(1000)} WHERE userid = ${userid}`);
    }
    else await con.query(`UPDATE data SET ${key[0]} = ${player.data[key[0]] + Number(Gems[gem][part][stat])} WHERE userid = ${userid}`);

    await con.query(`UPDATE slots SET ${part} = ${newGemsNumber} WHERE userid = ${userid}`);

    const successEmbed = new EmbedBuilder()
        .setTitle(lang.bind.title)
        .setColor(interaction.member.displayColor)
        .setThumbnail("https://cdn.discordapp.com/emojis/1084492365168922714.webp")
        .addFields({ name: lang.bind.success, value: lang.bind.successfullyBinded.replace("%s", `${Emotes[gem]} **${gem}**`).replace("%s", `${Emotes.enchant[`rune_${part}`]} **${part}**`) })
        .setTimestamp()
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    bind.edit({ embeds: [successEmbed] });
};