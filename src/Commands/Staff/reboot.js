module.exports = {
    data: {
        name: "reboot",
        description: "Restart the bot",
        default_member_permissions: (1 << 30)
    },
    async execute(client, interaction) {
        interaction.reply({ content:"⚙ Redémarrage en cours...", ephemeral: true }).then(() => {
            client.user.setActivity("processing reboot...", { type: "WATCHING" })
            process.exit();
        });
    }
};