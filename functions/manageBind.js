const { MessageEmbed } = require("discord.js");
const { MessageButton } = require("discord-buttons");
const Gems = require("../utils/items/gems.json");
const Emotes = require("../utils/emotes.json");

module.exports = async function manageBind(con, player, message, gem, part, slot, stat, bind) {
    const lang = require(`../utils/text/${player.data.lang}.json`);
    const userid = message.author.id;

    const obj = Gems[gem][part];

    const key = Object.keys(obj);

    await con.query(`UPDATE prospect SET ${gem} = ${player.prospect[gem] - Number(1)} WHERE userid = ${userid}`);

    await con.query(`UPDATE data SET ${key[0]} = ${player.data[key[0]] + Number(Gems[gem][part][stat])} WHERE userid = ${userid}`);

    await con.query(`UPDATE slots SET ${slot} = 1 WHERE userid = ${userid}`);

    const successEmbed = new MessageEmbed()
        .setTitle(lang.bind.title)
        .setColor(message.member.displayColor)
        .setThumbnail("https://cdn.discordapp.com/attachments/691992473999769623/850298943467159552/emptySocket.png")
        .addField(lang.bind.success, lang.bind.successfullyBinded.replace("%s", `${Emotes[gem]} **${gem}**`).replace("%g", `${Emotes.enchant[`rune_${part}`]} **${part}**`))
        .setTimestamp()
        .setFooter(message.author.tag, message.author.displayAvatarURL());

    let successButton = new MessageButton().setStyle("green").setEmoji("780222056007991347").setID("success").setDisabled(true);

    bind.edit(successEmbed, successButton);
};

/*
on clique sur le socket
(la vérification des gemmes du joueur et du level de l'équipement sont déjà check)
il faut :
enlever la gemme
ajouter la stat de la gemme en question :arold:
et il faut édit le bon endroit (le slot qui correspond à la pièce d'équipement) genre "slot_a_head" ou "slot_b_hands"
*/