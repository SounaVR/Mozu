const { Formatters } = require('discord.js')

module.exports = {
    name: "eval",
    description: "🔞",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "code",
            description: "Provide code porc favorre",
            type: "STRING",
            required: true
        }
    ],
    async execute(client, interaction) {
        const code = interaction.options.getString("code");
        const clean = text => 
            typeof (text) === "string" ? text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : text;
        
        try {
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            
            await interaction.reply(Formatters.codeBlock('xl', clean(evaled)));
        } catch (err) {
           interaction.reply({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\`` });
        }
    }
};