const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js'),
Emotes = require('../../../utils/emotes.json'),
Default = require('../../../utils/default.json');

module.exports = {
    name: 'gift',
    description: 'Donner de l\'argent à un autre joueur',
    options : [
        {
            name: 'membre',
            description: 'Sélectionnez un utilisateur.',
            type: 'USER',
            required: true
        },
        {
            name: 'montant',
            description: 'Mettez un montant supérieur à 0.',
            type: 'NUMBER',
            required: true
        }
    ],
    async execute(client, interaction, getPlayer, getUser) {
        const { user, member, options } = interaction;
        const target = options.getMember('membre');
        const amount = options.getNumber('montant');

        const con = client.connection;
        const player = await getPlayer(con, user.id);
        const targetDB = await getUser(con, target.id);
        if (!player) return interaction.reply(Default.notRegistered);
        if (!targetDB) return interaction.reply(`${Default.targetNotRegistered}`);
        const lang = require(`../../utils/Text/${player.data.lang}.json`);
        const react = ["780222056007991347", "780222833808506920"];

        if (target.id === user.id) return interaction.reply(`${lang.give.giveToSelf}`);
        if (amount > 0) {
            const embed = new MessageEmbed()
                .setColor(member.displayColor)
                .setTitle(lang.gift.transfer)
                .setDescription(`${lang.gift.state} ${lang.gift.state_pending} ${Emotes.loading}`)
                .addField(`${lang.gift.from}`, `${user}`, true)
                .addField(`${lang.gift.for}`, `${target}`, true)
                .addField(`${lang.gift.amount}`, `**${Math.floor(amount)}**${Emotes.cash}`, true)

            let validButton = new MessageButton().setStyle('SUCCESS').setEmoji(react[0]).setCustomId('valid');
            let cancelButton = new MessageButton().setStyle('DANGER').setEmoji(react[1]).setCustomId('cancel');

            let buttonRow = new MessageActionRow()
                .addComponents([validButton, cancelButton]);

            const msg = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });

            const filter = (interact) => interact.user.id === user.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

            collector.on('collect', async button => {
                validButton.setDisabled(true);
                cancelButton.setDisabled(true);

                switch (button.customId) {
                    case 'valid':
                        let player = await getPlayer(con, user.id);
                        if (player.data.money < amount) {
                            collector.stop();
                            return msg.edit({ components: [], embeds: [], content: `${lang.gift.notEnoughMoney.replace("%s", `**${Math.abs(amount - player.data.money)}**${Emotes.cash}`)}` });
                        }
                        con.query(`UPDATE data SET money = ${player.data.money - Number(amount)} WHERE userid = ${user.id}`);
                        con.query(`UPDATE data SET money = ${targetDB.data.money + Number(amount)} WHERE userid = ${target.id}`);
                        const embedProcessing = new MessageEmbed()
                            .setColor(member.displayColor)
                            .setTitle(lang.gift.transfer)
                            .setDescription(`${lang.gift.state} ${lang.gift.state_done} ${Emotes.checked}`)
                            .addField(`${lang.gift.from}`, `${user}`, true)
                            .addField(`${lang.gift.for}`, `${target}`, true)
                            .addField(`${lang.gift.amount}`, `**${amount}**${Emotes.cash}`, true)

                        msg.edit({ components: [], embeds: [embedProcessing] });
                        break;
                
                    case 'cancel':
                        collector.stop();
                        const embedCanceled = new MessageEmbed()
                            .setColor(member.displayColor)
                            .setTitle(lang.gift.transfer)
                            .setDescription(`${lang.gift.state} ${lang.gift.state_canceled} ${Emotes.cancel}`)
                            .addField(`${lang.gift.from}`, `${user}`, true)
                            .addField(`${lang.gift.for}`, `${target}`, true)
                            .addField(`${lang.gift.amount}`, `**${Math.floor(amount)}**${Emotes.cash}`, true)
                        return msg.edit({ components: [], embeds: [embedCanceled] });
                }
            });
        } else {
            return interaction.reply(`${lang.gift.invalidAmount}`);
        }
    }
}