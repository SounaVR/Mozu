const { CommandInteraction, MessageEmbed } = require('discord.js');
const db = require('../../utils/Models/infractions');
const moment = require('moment');

module.exports = {
    name: "warnings",
    description: "Pour avertir quelqu'un avant le mute ou le ban",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "add",
            description: "Ajoute un warning",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "cible",
                    description: "Sélectionnez une cible",
                    type: "USER",
                    required: true
                },
                {
                    name: "raison",
                    description: "Fournissez une raison",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "check",
            description: "Affiche les avertissements",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "cible",
                    description: "Sélectionnez une cible",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Supprime un avertissement spécifique",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "cible",
                    description: "Sélectionnez une cible",
                    type: "USER",
                    required: true
                },
                {
                    name: "warnid",
                    description: "Fournissez l'ID du warn",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "clear",
            description: "Supprime tout les avertissements",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "cible",
                    description: "Sélectionnez une cible",
                    type: "USER",
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const target = options.getMember("cible");
        const reason = options.getString("raison");
        const warnID = options.getNumber("warnid") - 1;
        const warnDate = moment.utc(interaction.createdAt).format("DD/MM/YYYY");
        const warnEmbed = new MessageEmbed()
            .setAuthor({ name: "Système d'avertissement", iconURL: target.user.displayAvatarURL({ dynamic: true }) })
            .setColor("RED")

        switch (sub) {
            case "add":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (!data) {
                        data = new db({
                            GuildID: interaction.guildId,
                            UserID: target.id,
                            UserTag: target.user.tag,
                            WarnData: [
                                {
                                    ExecuterID: interaction.user.id,
                                    ExecuterTag: interaction.user.tag,
                                    Reason: reason,
                                    Date: warnDate
                                }
                            ],
                        })
                    } else {
                        const obj = {
                            ExecuterID: interaction.user.id,
                            ExecuterTag: interaction.user.tag,
                            Reason: reason,
                            Date: warnDate
                        }
                        data.WarnData.push(obj)
                    };
                    data.save();
                });
                warnEmbed.setDescription(`Avertissement ajouté : ${target.user.tag} | ${target.id}\n**Raison**: ${reason}`);
                interaction.reply({ embeds: [warnEmbed] });
                break;
            case "check":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data?.WarnData.length > 0 && data) {
                        warnEmbed.setDescription(`${data.WarnData.map(
                            (w, i) => `**ID**: ${i + 1}\n**Par**: ${w.ExecuterTag}\n**Date**: ${w.Date}\n**Raison**: ${w.Reason}
                            \n`
                        ).join(" ")}`);
                        interaction.reply({ embeds: [warnEmbed] });
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} n'a pas d'avertissements.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
            case "remove":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        data.WarnData.splice(warnID, 1);
                        warnEmbed.setDescription(`${target.user.tag}'s **Warning ID**: "${warnID + 1}" a bien été supprimé.`);
                        interaction.reply({ embeds: [warnEmbed] });
                        data.save();
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} n'a pas d'avertissements.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
            case "clear":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        await db.findOneAndDelete({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag });

                        warnEmbed.setDescription(`Les avertissements de ${target.user.tag} | ${target.id} ont bien été supprimés.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} n'a pas d'avertissements.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
        }
    }
}