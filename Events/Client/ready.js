const { DBURL } = process.env;
const { Client, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const moment  = require("moment");
moment.locale("fr");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        mongoose.connect(DBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The client is now connected to the database ✅");
        }).catch((err) => {
            console.log(err);
        });
        const rdy = client.channels.cache.find(ch => ch.id === "930481555879645277");
        const start = client.channels.cache.find(channel => channel.id === "930481568840040448");
        client.user.setActivity("sa résurrection", { type: "WATCHING" });

        const embed = new MessageEmbed()
            .setTitle(`[SYSTEM START] Log du ${moment().format('DD/MM/YYYY | HH:mm:ss')}`)
            .setDescription(`${client.user.username} just started !`)
            .setColor("#1DCC8F")
        start.send({ embeds: [embed] });

        rdy.send(`✅ Bot connecté et prêt !`);
    }
}