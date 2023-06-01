const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const eventsPath = path.join(__dirname, '../Events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        event.once ? client.once(event.name, (...args) => event.execute(client, ...args)) 
        : client.on(event.name, (...args) => event.execute(client, ...args));
    }
}