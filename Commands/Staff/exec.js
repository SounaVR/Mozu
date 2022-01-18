const { exec } = require("child_process");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "exec",
    description: "💻",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "command",
            description: "execute an command",
            type: "STRING",
            required: true
        }
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.user.id !== "436310611748454401") return interaction.react("❌");

        exec(`${interaction.options.getString("command")}`, (error, stdout, stderr) => {
            if (error) {
                interaction.reply(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                interaction.reply(`stderr: ${stderr}`);
                return;
            }
            interaction.reply(`\`\`\`\n${stdout}\n\`\`\``);
        });
    }
};