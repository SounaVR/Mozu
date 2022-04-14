const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const Gems = require("../utils/Items/gems.json");
const Emotes = require("../utils/emotes.json");
const Player = require("../Classes/Player");

module.exports = async function manageBind(con, player, interaction, gem, part, stat, bind, number, slot) {
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const userid = interaction.user.id;

    const obj = Gems[gem][part];

    const key = Object.keys(obj);

    await con.query(`UPDATE prospect SET ${gem} = ${player.prospect[gem] - Number(1)} WHERE userid = ${userid}`);

    let [gemNumber] = await con.query(`SELECT ${part} FROM slots WHERE userid = ${userid}`);

    let gems = Player.getGems(gemNumber);

    gems[slot] = number;

    const newGemsNumber = Player.getGemNumber(gems);

    if (stat === "energyCooldown") {
        await con.query(`UPDATE data SET energyCooldown = ${player.data.energyCooldown - Number(1000)} WHERE userid = ${userid}`);
    }
    else await con.query(`UPDATE data SET ${key[0]} = ${player.data[key[0]] + Number(Gems[gem][part][stat])} WHERE userid = ${userid}`);

    await con.query(`UPDATE slots SET ${part} = ${newGemsNumber} WHERE userid = ${userid}`);

    const successEmbed = new MessageEmbed()
        .setTitle(lang.bind.title)
        .setColor(interaction.member.displayColor)
        .setThumbnail("https://cdn.discordapp.com/attachments/691992473999769623/850298943467159552/emptySocket.png")
        .addField(lang.bind.success, lang.bind.successfullyBinded.replace("%s", `${Emotes[gem]} **${gem}**`).replace("%s", `${Emotes.enchant[`rune_${part}`]} **${part}**`))
        .setTimestamp()
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    let successButton = new MessageButton().setStyle("SUCCESS").setEmoji("780222056007991347").setCustomId("success").setDisabled(true);
    let successRow = new MessageActionRow()
        .addComponents([successButton]);

    bind.edit({ components: [successRow], embeds: [successEmbed] });
};