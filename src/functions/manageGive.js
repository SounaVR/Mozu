const { MessageButton, MessageActionRow } = require('discord.js');
const Emotes = require('../utils/emotes.json');

module.exports = async function manageGive(con, player, target, targetDB, interaction, objectName, amount) {
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];
    const userid = interaction.user.id;

    let validButton = new MessageButton().setStyle('SUCCESS').setEmoji(react[0]).setCustomId('valid');
    let cancelButton = new MessageButton().setStyle('DANGER').setEmoji(react[1]).setCustomId('cancel');

    let buttonRow = new MessageActionRow()
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