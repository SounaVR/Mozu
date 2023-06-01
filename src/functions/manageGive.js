const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Emotes = require('../utils/emotes.json');

module.exports = async function manageGive(con, player, target, targetDB, interaction, objectName, amount) {
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const react = ["1065891789506093078", "1065891556093067315"];
    const userid = interaction.user.id;

    const validButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setEmoji(react[0]).setCustomId('valid');
    const cancelButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji(react[1]).setCustomId('cancel');

    const buttonRow = new ActionRowBuilder()
        .addComponents([validButton, cancelButton]);

    const msg = await interaction.reply({ components: [buttonRow], content: `${lang.give.wantGive.replace("%s", `**${amount} ${lang.inventory[objectName]}**${Emotes[objectName]}`).replace("%s", target)}`, fetchReply: true })

    const filter = (interact) => interact.user.id === userid;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', button => {
        validButton.setDisabled(true);
        cancelButton.setDisabled(true);

        switch (button.customId) {
            case 'valid':
                if (player.ress[objectName] < amount) {
                    collector.stop();
                    return msg.edit({ components: [], content: `${Emotes.cancel} ${lang.give.notEnoughRess}` });
                }
                con.query(`UPDATE ress SET ${objectName} = ${player.ress[objectName] - amount} WHERE userid = ${userid}`);
                con.query(`UPDATE ress SET ${objectName} = ${targetDB.ress[objectName] + Number(amount)} WHERE userid = ${target.id}`);
                msg.edit({ components: [], content: `${Emotes.checked} ${lang.give.giveSuccess.replace("%s", `**${amount} ${lang.inventory[objectName]}**${Emotes[objectName]}`).replace("%s", `**${target}**`)}` });
                collector.stop();
                break;

            case 'cancel':
                collector.stop();
                msg.edit({ components: [], content: `${Emotes.cancel} ${lang.give.canceled}` });
                break;
        }
    });
}