const { Events, ActivityType } = require('discord.js');
const duration = require('dayjs/plugin/duration');
const dayjs = require('dayjs');
const cron = require('cron');
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

        // const { exec } = require ('child_process');
        const channel = client.channels.cache.find(ch => ch.id === '1106251984580911124');
        const dailyReset = new cron.CronJob('00 00 * * *', async () => {
            try {
                // exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u ${process.env.BACKUP_USERNAME} -p ${process.env.BACKUP_PASSWORD}`);
                // exec(`zsh -c 'rm **/*(.om[-1])'`);
                client.query(`UPDATE data SET LastRep = 0, LastDaily = 0`);
                // channel.send(`🟢 Daily backup done.`);
            } catch (error) {
                channel.send("🔴 An error occurred.");
                if (error) throw error;
            }
        });

        dailyReset.start();

        console.log("Bot ready ✅");
    }
}