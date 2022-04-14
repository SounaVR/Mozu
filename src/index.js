require('dotenv').config();
const { BOT_TOKEN } = process.env;
const Mozu = require('../Classes/Client');

const client = new Mozu();

client.login(BOT_TOKEN);