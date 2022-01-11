const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "unmute",
    description: "Pour démute quelqu'un",
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
            required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("membre");
        const reason = options.getString("raison") || "Aucune.";
        const mute = guild.roles.cache.get("899628186541903912");

        const response = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: "Système de mute", iconURL: guild.iconURL({ dynamic: true }) });

        if (target.id === member.id) {
            response.setDescription("⛔ Vous pouvez pas vous auto-unmute.");
            return interaction.reply({ embeds: [response] });
        }

        if (target.roles.highest.position > member.roles.highest.position) {
            response.setDescription("⛔ Vous pouvez pas unmute quelqu'un avec un rôle supérieur au votre.");
            return interaction.reply({ embeds: [response] });
        }

        if (target.permissions.has(this.permission)) {
            response.setDescription(`⛔ Vous pouvez pas unmute quelqu'un avec la permission \`${this.permission}\`.`);
            return interaction.reply({ embeds: [response] });
        }

        if (!mute) {
            response.setDescription(`⛔ Le rôle mute n'a pas été trouvé.`);
            return interaction.reply({ embeds: [response] });
        }

        target.send({ embeds: [
            new MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: "Système de mute", iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`Vous avez été unmute par ${member} dans **${guild.name}**\nRaison: ${reason}`)
        ]}).catch(() => { return; });

        response.setDescription(`Membre: ${target} | \`${target.id}\` a été **unmute**\nPar: ${member} | \`${member.id}\`\nRaison: \`${reason}\``)
        interaction.reply({ embeds: [response] });

        if (!target.roles.cache.has(mute.id)) return;
        await target.roles.remove(mute);

        const logEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "Système de mute", iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(`Membre: ${target} | \`${target.id}\` a été **unmute**\Par: ${member} | \`${member.id}\`\nRaison: \`${reason}\``)
            .setTimestamp()

        client.channels.cache.get("899629148065124434").send({ embeds: [logEmbed] });
    }
}