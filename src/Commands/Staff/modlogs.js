const { MessageEmbed } = require('discord.js');
const db = require('../../../utils/infractions');

module.exports = {
    name: "modlogs",
    description: "Affiche les infractions du membre sélectionné.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un membre",
            type: "USER",
            required: true
        },
        {
            name: "check",
            description: "Sélectionnez un type spécifique d'infraction à afficher",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "ALL",
                    value: "all"
                },
                {
                    name: "WARNINGS",
                    value: "warnings"
                },
                {
                    name: "BANS",
                    value: "bans"
                },
                {
                    name: "KICKS",
                    value: "kicks"
                },
                {
                    name: "MUTES",
                    value: "mutes"
                }
            ]
        }
    ],
    async execute(client, interaction) {
        const { guild, options } = interaction;

        const target = options.getMember("membre");
        const choice = options.getString("check");

        const response = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name:"Mod logs", iconURL: guild.iconURL({ dynamic: true }) })

        switch (choice) {
            case "all":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        const warns = data.WarnData.length;
                        const bans = data.BanData.length;
                        const kicks = data.KickData.length;
                        const mutes = data.MuteData.length;

                        response.setDescription(`Membre: ${target} | ${target.id}\n
                        **Warnings**: ${warns}\n**Bans**: ${bans}\n**Kicks**: ${kicks}\n**Mutes**: ${mutes}`)
                        interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} n'a pas d'infractions.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "warnings" :
                db.findOne({ GuildID: guild.id, UserID: target.id }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.WarnData.length < 1) {
                            response.setDescription(`${target} n'a pas d'avertissements.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Avertissements de : ${target} | ${target.id}\n
                        ` + `${data.WarnData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Raison**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} n'a pas d'avertissements.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "bans":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.BanData.length < 1) {
                            response.setDescription(`${target} n'a pas bans.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Bans de : ${target} | ${target.id}\n
                        ` + `${data.BanData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Raison**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} n'a pas bans.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "kicks":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.KickData.length < 1) {
                            response.setDescription(`${target} n'a pas de kicks.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Kicks de : ${target} | ${target.id}\n
                        ` + `${data.KickData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Raison**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} n'a pas de kicks.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "mutes":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.MuteData.length < 1) {
                            response.setDescription(`${target} n'a pas de mutes.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Mutes de : ${target} | ${target.id}\n
                        ` + `${data.MuteData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Raison**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} n'a pas de mutes.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
        }
    }
}