const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = async function manageProspecting(client, player, interaction, ore, quantity, gem, stat) {
    const lang = require(`../utils/Text/${player.data.lang}.json`);
    const react = ['1065891789506093078', '1065891556093067315'];

    const embed = new EmbedBuilder()
        .setColor(interaction.member.displayColor);

    const getNeededRessource = quantity * 150000;

    embed.setTitle(`Do you want to prospect that ?`);
    const txt = [];

    if (player.ress[ore] < getNeededRessource) txt.push(`${client.Emotes[ore]} ${ore} : ${client.nFormatter(getNeededRessource)} (${client.Emotes.cancel} - Missing ${client.nFormatter(Math.floor(getNeededRessource-player.ress[ore]))})`);
    if (player.ress[ore] >= getNeededRessource) txt.push(`${client.Emotes[ore]} ${ore} : ${client.nFormatter(getNeededRessource)} (${client.Emotes.checked})`);

    embed.addFields(
        { name: `**${lang.craft.cost}**`, value: `${txt}` },
        { name: "**Reward**", value: `${client.Emotes[gem]} ${gem} x${quantity}\n*${stat}*` }
    )

    const validButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setEmoji(react[0]).setCustomId('valid');
    const cancelButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji(react[1]).setCustomId('cancel');

    const buttonRow = new ActionRowBuilder()
        .addComponents([validButton, cancelButton]);

    const msg = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });
    const collector = msg.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 30000 });

    collector.on('collect', async button => {
        if (button.user.id !== interaction.user.id) return button.reply({ content: lang.notTheAuthorOfTheInteraction, ephemeral: true });

        switch(button.customId) {
            case 'valid':
                const need = [];
                const resssql = [];

                if (player.ress[ore] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`${ore} = ${ore} - ${getNeededRessource}`);

                if (need.length >= 1) {
                    collector.stop();
                    msg.edit({ embeds: [embed], components: [] });
                    return button.reply(`${lang.prospect.notEnoughRess}`);
                }

                await client.query(`UPDATE ress SET ${resssql.join(',')} WHERE userid = ${interaction.user.id}`);
                await client.query(`UPDATE prospect SET ${gem} = ${player.prospect[gem] + Number(quantity)} WHERE userid = ${interaction.user.id}`);

                collector.stop();
                msg.edit({ embeds: [embed], components: [] });
                return button.reply(`${client.translate(player.data.lang, 'prospect.success', `${client.Emotes[gem]} **${gem}** x${quantity}`)}`);

            case 'cancel':
                msg.edit({ embeds: [embed], components: [] });
                return button.reply(`${lang.prospect.canceled}`);
        }
    });
}