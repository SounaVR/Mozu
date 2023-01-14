require('dotenv').config();
const { Client, Collection } = require('discord.js');
const EventHandler = require('../Handlers/Events');

const client = new Client(({
    intents: 1799,
    allowedMentions: { parse: ["users", "roles"], repliedUser: true },
    restTimeOffset: 250
}));

client.commands = new Collection();
EventHandler(client);

client.login(process.env.BOT_TOKEN);