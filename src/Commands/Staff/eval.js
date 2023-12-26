const { codeBlock, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    data: {
        name: "eval",
        description: "🔞",
        default_member_permissions: (1 << 30),
        options: [
            {
                name: "code",
                description: "Provide code porc favorre",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ] 
    },
    async execute(client, interaction) {
        const code = interaction.options.getString("code");
        const clean = text => 
            typeof (text) === "string" ? text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : text;

        try {
            let evaled = await eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            const embed = new EmbedBuilder()
                .setDescription(codeBlock('xl', clean(evaled).slice(0, 4086)))

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
           interaction.reply({ content: `\`ERROR\` ${codeBlock('xl', clean(err))}` });
        }
    }
};