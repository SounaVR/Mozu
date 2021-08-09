exports.run = async (client, message, args, getPlayer, getUser) => {
    const m = await message.channel.send("Ping ?");
    const ping = Math.round(m.createdTimestamp - message.createdTimestamp);
    m.edit(`
        P${'o'.repeat(Math.min(Math.round(ping / 100), 1500))}ng! <:notlikethis:827974730292264990>\nLatence ► ${ping}ms.\nAPI Discord ► ${Math.round(client.ws.ping)}ms.`);
};

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 */
exports.slashRun = async (client, interaction) => {
    const m = await interaction.deferReply('Ping ?');
    await interaction.editReply(`
        P${'o'.repeat(Math.min(Math.round(client.ws.ping / 100), 1500))}ng! <:notlikethis:827974730292264990>\nAPI Discord ► ${Math.round(client.ws.ping)}ms.
    `);
}

exports.help = {
    name: "ping",
    description_fr: "Affiche la latence du bot",
    description_en: "Displays bot latency",
    category: "Infos",
    aliases: ["pong"]
};
