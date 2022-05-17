const { MessageEmbed } = require('discord.js');
const { getUser, getPlayer } = require("../../utils/u");

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("⛔ An error occurred while running this command.")
            ]}) && client.commands.delete(interaction.commandName);

            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND') {
                    option.options?.forEach((x) => {
                        if (x.value) args.push(option.value);
                    });
                } else if (option.value) args.push(option.value);
            };

            command.execute(client, interaction, getPlayer, getUser, args);
        }
    }
}