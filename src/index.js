require('dotenv').config();
const Mozu = require('./Classes/Client');

const client = new Mozu();

client.login(process.env.BOT_TOKEN);