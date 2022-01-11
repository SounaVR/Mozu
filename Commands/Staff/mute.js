const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const db = require('../../utils/Models/infractions');
const ms = require('ms');

module.exports = {
    name: "mute",
    description: "Pour mute quelqu'un",
    permission: "MUTE_MEMBERS",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un membre",
            type: "USER",
            required: true
        },
        {
            name: "raison",
            description: "Fournissez une raison",
            type: "STRING",
            required: true
        },
        {
            name: "durée",
            description: "Sélectionnez une durée",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "30 minutes",
                    value: "30m"
                },
                {
                    name: "1 heure",
                    value: "1h"
                },
                {
                    name: "3 heures",
                    value: "3h"
                },
                {
                    name: "1 jour",
                    value: "1d"
                },
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("membre");
        const reason = options.getString("raison");
        const duration = options.getString("durée");
        const mute = guild.roles.cache.get("899628186541903912");

        const response = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor("Système de mute", guild.iconURL({ dynamic: true }));

        if (target.id === member.id) {
            response.setDescription("⛔ Vous pouvez pas vous auto-mute.");
            return interaction.reply({ embeds: [response] });
        }

        if (target.roles.highest.position > member.roles.highest.position) {
            response.setDescription("⛔ Vous pouvez pas mute quelqu'un avec un rôle supérieur au votre.");
            return interaction.reply({ embeds: [response] });
        }

        if (target.permissions.has(this.permission)) {
            response.setDescription(`⛔ Vous pouvez pas mute quelqu'un avec la permission \`${this.permission}\`.`);
            return interaction.reply({ embeds: [response] });
        }

        if (target.roles.cache.has(mute.id)) {
            response.setDescription(`⛔ Vous pouvez pas mute quelqu'un qui est déjà mute, veuillez l'unmute d'abord.`);
            return interaction.reply({ embeds: [response] });
        }

        if (!mute) {
            response.setDescription(`⛔ Le rôle mute n'a pas été trouvé.`);
            return interaction.reply({ embeds: [response] });
        }

        db.findOne({ GuildID: guild.id, UserID: target.id }, async(err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    GuildID: guild.id,
                    UserID: target.id,
                    MuteData: [
                        {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: target.id,
                            TargetTag: target.user.tag,
                            Reason: reason,
                            Duration: duration,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const muteDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: target.id,
                    TargetTag: target.user.tag,
                    Reason: reason,
                    Duration: duration,
                    Date: parseInt(interaction.createdTimestamp / 1000)
                }
                data.MuteData.push(muteDataObject);
            }
            data.save();
        });

        target.send({ embeds: [
            new MessageEmbed()
                .setColor("RED")
                .setAuthor("Système de mute", guild.iconURL({ dynamic: true }))
                .setDescription(`Vous avez été mute par ${member} dans **${guild.name}**\nRaison: ${reason}\nDurée: ${duration}`)
        ]}).catch(() => { return; });

        response.setDescription(`Membre: ${target} | \`${target.id}\` a été **mute**\nPar: ${member} | \`${member.id}\`\nDurée: \`${duration}\`\nRaison: \`${reason}\``)
        interaction.reply({ embeds: [response] });

        await target.roles.add(mute.id);
        setTimeout(async () => {
            if (!target.roles.cache.has(mute.id)) return;
            await target.roles.remove(mute);
        }, ms(duration));

        const logEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("Système de mute", guild.iconURL({ dynamic: true }))
            .setDescription(`Membre: ${target} | \`${target.id}\` a été **mute**\Par: ${member} | \`${member.id}\`\nDurée: \`${duration}\`\nRaison: \`${reason}\``)
            .setTimestamp()

        client.channels.cache.get("899629148065124434").send({ embeds: [logEmbed] });
    }
}