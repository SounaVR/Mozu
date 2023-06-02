const { Events, ActivityType } = require('discord.js');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const fs = require('fs');
dayjs.extend(duration);

dayjs.locale("fr");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Initialize the SQL tables
        const tables = ["data", "enchant", "idle", "items", "prospect", "ress", "slots", "stats"];
        tables.forEach(async element => {
            const thing = fs.readFileSync(`sql/${element}.sql`).toString();
            client.query(thing, function (err) {
                if (err) {
                    console.error("\nThe database is maybe offline. Please check and try again.\n");
                    throw err;
                }
            });
        });

        client.user.setActivity('death.', { type: ActivityType.Competing });
        client.user.setStatus('dnd');

        console.log("Bot ready ✅");
    }
}