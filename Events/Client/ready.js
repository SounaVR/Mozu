const { DB_HOST, DB_USER, DB_NAME, DB_PASS, MONGO_URL } = process.env;
const { MessageEmbed } = require('discord.js');
const moment  = require("moment"),
    mongoose  = require('mongoose'),
    mysql     = require('mysql'),
    cron      = require('cron'),
    fs        = require('fs');
moment.locale("fr");

const con = mysql.createConnection({
    multipleStatements: true,
    encoding: 'utf8',
    charset: 'utf8mb4',
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The client is now connected to MongoDB ✅");
        }).catch((err) => {
            console.log(err);
        });
        client.connection = con;

        // Initialize the SQL tables
        const tables = ["data", "enchant", "items", "prospect", "ress", "slots", "stats"];
        tables.forEach(async element => {
            const thing = fs.readFileSync(`../sql/${element}.sql`).toString();
            con.query(thing, function (err) {
                if (err) throw err;
            });
        });

        const channel = client.channels.cache.find(ch => ch.id === "930481568840040448");
        
        client.user.setActivity("sa résurrection", { type: "WATCHING" });

        const { exec } = require ('child_process');
        // -----------------
        // CRON MEMO
        // *  *  *  *  *  *
        // |  |  |  |  |  |
        // |  |  |  |  |  jour de la semaine
        // |  |  |  |  mois
        // |  |  |  jour du mois
        // |  |  heures
        // |  minutes
        // secondes (optionnelles)

        let dailyReset = new cron.CronJob('00 00 * * *', async () => {
            try {
                exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u Souna -p ${process.env.BACKUP_PASSWORD}`);
                exec(`zsh -c 'rm **/*(.om[-1])'`);
                con.query(`UPDATE data SET LastRep = 0, LastDaily = 0`);
                channel.send(`🟢 Daily backup done.`);
            } catch (error) {
                channel.send("🔴 An error occurred.");
                if (error) throw error;
            }
        });

        dailyReset.start();

        // Keeps the database online
        // setInterval(function () {
        //     con.query('SELECT 1');
        // }, 2, 52e+7);

        const embed = new MessageEmbed()
            .setTitle(`[SYSTEM START] Log du ${moment().format('DD/MM/YYYY | HH:mm:ss')}`)
            .setDescription(`${client.user.username} just started !`)
            .setColor("#1DCC8F")
        channel.send({ embeds: [embed] });

        console.log('✅ Bot connected and ready !');
    }
}