const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const { nFormatter } = require('../utils/u');
const Emotes = require('../utils/emotes.json');

module.exports = async function manageProspecting(client, con, player, interaction, ore, quantity, gem, stat) {
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const react = ['780222056007991347', '780222833808506920'];

    const embed = new MessageEmbed()
        .setColor(interaction.member.displayColor);

    const getNeededRessource = quantity * 150000;

    embed.setTitle(`Do you want to prospect that ?`);
    let txt = [];

    if (player.ress[ore] < getNeededRessource) txt.push(`${Emotes[ore]} ${ore} : ${nFormatter(getNeededRessource)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(getNeededRessource-player.ress[ore]))})`);
    if (player.ress[ore] >= getNeededRessource) txt.push(`${Emotes[ore]} ${ore} : ${nFormatter(getNeededRessource)} (${Emotes.checked})`);

    embed.addField(`**${lang.craft.cost}**`, `${txt}`);
    embed.addField("**Reward**", `${Emotes[gem]} ${gem} x${quantity}\n*${stat}*`);

    let validButton = new MessageButton().setStyle('SUCCESS').setEmoji(react[0]).setCustomId('valid');
    let cancelButton = new MessageButton().setStyle('DANGER').setEmoji(react[1]).setCustomId('cancel');

    let buttonRow = new MessageActionRow()
        .addComponents([validButton, cancelButton]);

    const msg = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });

    const filter = (interact) => interact.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', button => {
        switch(button.customId) {
            case 'valid':
                let need = [];
                let resssql = [];

                if (player.ress[ore] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`${ore} = ${ore} - ${getNeededRessource}`);

                if (need.length >= 1) {
                    collector.stop();
                    msg.edit({ embeds: [embed], components: [] });
                    return interaction.channel.send(`${lang.prospect.notEnoughRess}`);
                }

                con.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${interaction.user.id}`);
                con.query(`UPDATE prospect SET ${gem} = ${player.prospect[gem] + Number(quantity)} WHERE userid = ${interaction.user.id}`);

                collector.stop();
                msg.edit({ embeds: [embed], components: [] });
                return interaction.channel.send(`${lang.prospect.success.replace("%s", `${Emotes[gem]} **${gem}** x${quantity}`)}`);

            case 'cancel':
                msg.edit({ embeds: [embed], components: [] });
                return interaction.channel.send(`${lang.prospect.canceled}`);
        }
    });
}