require('dotenv').config();
const { BOT_TOKEN } = process.env;
const { Client, Collection } = require('discord.js');

const client = new Client({
	intents: 1799,
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	restTimeOffset: 250
});
require('./Handlers/Events')(client);
require('./Handlers/Commands')(client);

client.commands = new Collection();

client.login(BOT_TOKEN);