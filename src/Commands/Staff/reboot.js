module.exports = {
    name: "reboot",
    description: "Restart the bot",
    permission: "ADMINISTRATOR",
    async execute(client, interaction) {
        interaction.reply({ content:"⚙ Redémarrage en cours...", ephemeral: true }).then(() => {
            client.user.setActivity("processing reboot...", { type: "WATCHING" })
            process.exit();
        });
    }
};