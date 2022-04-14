const { MessageEmbed } = require('discord.js');
const db = require('../../../utils/infractions');

module.exports = {
    name: "ban",
    description: "Ban la cible",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un membre à ban",
            type: "USER",
            required: true
        },
        {
            name: "raison",
            description: "Fournissez une raison pour ce ban",
            type: "STRING",
            required: true
        },
        {
            name: "messages",
            description: "Fournissez le nombre de jours à supprimer (0-7j)",
            type: "NUMBER",
            required: true
        },
    ],
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("membre");
        const reason = options.getString("raison");
        const amount = options.getNumber("messages");

        const response = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "Système de bans", iconURL: guild.iconURL({ dynamic: true }) })

        if (target.id === member.id) {
            response.setDescription("⛔ Vous pouvez pas vous auto-ban.")
            return interaction.reply({ embeds: [response] });
        }

        if (target.roles.highest.position > member.roles.highest.position) {
            response.setDescription("⛔ Vous pouvez pas ban quelqu'un avec un rôle supérieur au votre.")
            return interaction.reply({ embeds: [response] });
        }

        if (target.permissions.has(this.permission)) {
            response.setDescription(`⛔ Vous pouvez pas ban quelqu'un avec la permission \`${this.permission}\`.`)
            return interaction.reply({ embeds: [response] });
        }

        if (amount > 7) {
            response.setDescription(`⛔ Le nombre de jours ne peut pas excéder (0-7j).`)
            return interaction.reply({ embeds: [response] });
        }

        db.findOne({ GuildID: interaction.guild.id, UserID: target.id }, async(err, data) => {
            if (err) throw err;
            if (!data || !data.BanData) {
                data = new db({
                    GuildID: guild.id,
                    UserID: target.id,
                    BanData: [
                        {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: target.id,
                            TargetTag: target.user.tag,
                            Messages: amount,
                            Reason: reason,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const banDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: target.id,
                    TargetTag: target.user.tag,
                    Messages: amount,
                    Reason: reason,
                    Date: parseInt(interaction.createdTimestamp / 1000)
                }
                data.BanData.push(banDataObject);
            }
            data.save();
        });

        await target.send({ embeds: [
            new MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: "Système de bans", iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`Vous avez été banni pour \`${reason}\``)
        ]}).catch(() => { return; });

        response.setDescription(`${target} a été banni pour \`${reason}\``)
        interaction.reply({ embeds: [response] });

        target.ban({ days: amount, reason: reason })
        .catch((error) => { console.log(error) });

        response.setDescription(`Le membre ${target.user.tag}/${target.user.id} a été banni pour \`${reason}\``)
        guild.channels.cache.get("899629148065124434").send({ embeds: [response] });
    }
}