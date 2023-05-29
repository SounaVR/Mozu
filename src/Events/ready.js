const { DB_HOST, DB_USER, DB_NAME, DB_PASS, MONGO_URL } = process.env;
const { Events, ActivityType } = require('discord.js');
const moment  = require("moment"),
    // mongoose  = require('mongoose'),
    mysql     = require('mysql'),
    // cron      = require('cron'),
    fs        = require('fs');
moment.locale("fr");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // mongoose.connect(MONGO_URL, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // }).then(() => {
        //     console.log("The client is now connected to MongoDB ✅");
        // }).catch((err) => {
        //     console.log(err);
        // });

        // Initialize the SQL tables
        const tables = ["data", "enchant", "idle", "items", "prospect", "ress", "slots", "stats"];
        tables.forEach(async element => {
            const thing = fs.readFileSync(`sql/${element}.sql`).toString();
            client.query(thing, function (err) {
                if (err) {
                    console.error("\nThe database is maybe offline. Please check and try again.\n")
                    throw err;
                }
            });
        });
        
        client.user.setActivity('death.', { type: ActivityType.Competing });
        client.user.setStatus('dnd');

        // const { exec } = require ('child_process');
        // -----------------
        // CRON MEMO
        // *  *  *  *  *  *
        // |  |  |  |  |  |
        // |  |  |  |  |  week day
        // |  |  |  |  month
        // |  |  |  month day
        // |  |  hours
        // |  minutes
        // seconds (optional)

        // let dailyReset = new cron.CronJob('00 00 * * *', async () => {
        //     try {
        //         exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u ${process.env.BACKUP_USERNAME} -p ${process.env.BACKUP_PASSWORD}`);
        //         exec(`zsh -c 'rm **/*(.om[-1])'`);
        //         con.query(`UPDATE data SET LastRep = 0, LastDaily = 0`);
        //         channel.send(`🟢 Daily backup done.`);
        //     } catch (error) {
        //         channel.send("🔴 An error occurred.");
        //         if (error) throw error;
        //     }
        // });

        // dailyReset.start();
    
        console.log("Bot ready ✅");
    }
}