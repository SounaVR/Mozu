/**
 * @author ReallySouna
 * @file hourly.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
    const Default = require("../../utils/default.json");
    const sqlite = require("sqlite3").verbose();
    const ms = require("parse-ms");
    let cooldown = 3600000;

    let userid = message.author.id;
    let uname = message.author.tag;
    let db = new sqlite.Database("./data/db.db", sqlite.OPEN_READWRITE);
    let query = `SELECT * FROM data WHERE userid = ?`;

    db.get(query, [userid], (err, row) => {
        if (err) {
            return catchErr(err, message);
        }
        if (row === undefined) {
            let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?,?,?)`);
            insertdata.run(userid, uname, Default.money, Default.LastDaily, Default.hr, Default.PV, Default.MANA, Default.LastActivity, Default.Energy);
            insertdata.finalize();
            db.close();
            message.channel.send("Veuillez patienter...").then(e => {
                setInterval(() => {
                    e.edit("Génération terminée, vous pouvez refaire la commande.");
                }, 1500)
            })
            return;
        } else {
            if (row.LastHR !== null && cooldown - (Date.now() - row.LastHR) > 0) {
            let timeObj = ms(cooldown - (Date.now() -  row.LastHR));

            message.channel.send(`Vous avez déjà collecté votre hourly, veuillez attendre encore **${timeObj.minutes}m** et **${timeObj.seconds}sec** !`);
        } else {
            message.channel.send(`${message.author.username}, bien ouej voilà tes 30 je sais pas quoi, à dans 1 heure !`);

            db.run(`UPDATE data SET LastHR = ? WHERE userid = ?`, [Date.now(), userid]);
            db.run(`UPDATE data SET Money = ? WHERE userid = ?`, [row.Money + 30, userid]);
        }
        }
    });
};

// Help Object
module.exports.help = {
    name: "hourly",
    description: "",
    usage: "",
    category: "RPG",
    aliases: ["hr"]
};
