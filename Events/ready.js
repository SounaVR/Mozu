const { Events, ActivityType } = require('discord.js');
const CommandsHandler = require('../Handlers/Commands');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await CommandsHandler(client);
        
        client.user.setActivity('death.', { type: ActivityType.Competing });
        client.user.setStatus('dnd');
    
        console.log("Bot ready.");
    }
}