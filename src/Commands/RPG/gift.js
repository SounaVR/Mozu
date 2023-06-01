const { ButtonBuilder, ActionRowBuilder, ApplicationCommandOptionType, EmbedBuilder, ActionRow, ButtonStyle } = require('discord.js'),
Emotes = require('../../utils/emotes.json'),
Default = require('../../utils/default.json');

module.exports = {
    data : {
        name: 'gift',
        description: 'To give money to another registered player',
        descriptionLocalizations: {
            fr: 'Pour donner de l\'argent à un autre joueur enregistré'
        },
        options : [
            {
                name: 'member',
                description: 'Select a valid user',
                descriptionLocalizations: {
                    fr: 'Sélectionnez un utilisateur valide'
                },
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'amount',
                description: 'Enter an amount greater than 0',
                descriptionLocalizations: {
                    fr: 'Indiquez un montant supérieur à 0'
                },
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ],
    },
    async execute(client, interaction) {
        const { user, member, options } = interaction;
        const target = options.getMember('member');
        const amount = options.getNumber('amount');

        const con = client.connection;
        const player = await client.getPlayer(user.id);
        const targetDB = await client.getPlayer(target.id);
        if (!targetDB) return interaction.reply(`${Default.targetNotRegistered}`);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);
        const react = ["1065891789506093078", "1065891556093067315"];

        if (target.id === user.id) return interaction.reply(`${lang.give.giveToSelf}`);
        if (amount > 0) {
            const embed = new EmbedBuilder()
                .setColor(member.displayColor)
                .setTitle(lang.gift.transfer)
                .setDescription(`${lang.gift.state} ${lang.gift.state_pending} ${Emotes.loading}`)
                .addFields(
                    { name: `${lang.gift.from}`, value: `${user}`, inline: true },
                    { name: `${lang.gift.for}`, value: `${target}`, inline: true },
                    { name: `${lang.gift.amount}`, value: `**${Math.floor(amount)}**${Emotes.cash}`, inline: true }
                )

            const validButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setEmoji(react[0]).setCustomId('valid');
            const cancelButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji(react[1]).setCustomId('cancel');

            const buttonRow = new ActionRowBuilder()
                .addComponents([validButton, cancelButton]);

            const msg = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });

            const filter = (interact) => interact.user.id === user.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

            collector.on('collect', async button => {
                validButton.setDisabled(true);
                cancelButton.setDisabled(true);

                switch (button.customId) {
                    case 'valid':
                        let player = await client.getPlayer(user.id);
                        if (player.data.money < amount) {
                            collector.stop();
                            return msg.edit({ components: [], embeds: [], content: `${lang.gift.notEnoughMoney.replace("%s", `**${Math.abs(amount - player.data.money)}**${Emotes.cash}`)}` });
                        }
                        con.query(`UPDATE data SET money = ${player.data.money - Number(amount)} WHERE userid = ${user.id}`);
                        con.query(`UPDATE data SET money = ${targetDB.data.money + Number(amount)} WHERE userid = ${target.id}`);
                        const embedProcessing = new EmbedBuilder()
                            .setColor(member.displayColor)
                            .setTitle(lang.gift.transfer)
                            .setDescription(`${lang.gift.state} ${lang.gift.state_done} ${Emotes.checked}`)
                            .addFields(
                                { name: `${lang.gift.from}`, value: `${user}`, inline: true },
                                { name: `${lang.gift.for}`, value: `${target}`, inline: true },
                                { name: `${lang.gift.amount}`, value: `**${amount}**${Emotes.cash}`, inline: true }
                            )

                        msg.edit({ components: [], embeds: [embedProcessing] });
                        break;

                    case 'cancel':
                        collector.stop();
                        const embedCanceled = new ButtonBuilder()
                            .setColor(member.displayColor)
                            .setTitle(lang.gift.transfer)
                            .setDescription(`${lang.gift.state} ${lang.gift.state_canceled} ${Emotes.cancel}`)
                            .addFields(
                                { name: `${lang.gift.from}`, value: `${user}`, inline: true },
                                { name: `${lang.gift.for}`, value: `${target}`, inline: true },
                                { name: `${lang.gift.amount}`, value: `**${Math.floor(amount)}**${Emotes.cash}`, inline: true }
                            )

                        return msg.edit({ components: [], embeds: [embedCanceled] });
                }
            });
        } else {
            return interaction.reply(`${lang.gift.invalidAmount}`);
        }
    }
}