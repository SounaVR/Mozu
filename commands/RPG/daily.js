/**
 * @author ReallySouna
 * @file daily.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
    const Default = require("../../utils/default.json");
    const sqlite = require("sqlite3").verbose();
    const ms = require("parse-ms");
    let cooldown = 8.64e+7;

    let userid = message.author.id;
    let uname = message.author.tag;
    let db = new sqlite.Database("./data/db.db", sqlite.OPEN_READWRITE);
    let query = `SELECT * FROM data WHERE userid = ?`;
    const queryD = 'SELECT * FROM data WHERE userid = ?'

    db.get(query, [userid], (err, row) => {
        if (err) return catchErr(err, message)

        db.get(queryD, [userid], (err, rowD) => {
          if (row === undefined || rowD === undefined) {
              message.channel.send("Vous n'êtes pas enregistré dans la base de données, veuillez faire la commande `r!inventory` pour vous y inscrire.");
              return;
        } else {
            if (row.LastDaily !== null && cooldown - (Date.now() - row.LastDaily) > 0) {
            let timeObj = ms(cooldown - (Date.now() -  row.LastDaily));

            message.channel.send(`Vous avez déjà collecté votre daily, veuillez attendre encore **${timeObj.hours}h** **${timeObj.minutes}m** et **${timeObj.seconds}sec** !`);
        } else {
            message.channel.send(`${message.author.username}, bien ouej voilà tes 300 je sais pas quoi, à demain.`);

            db.run(`UPDATE data SET LastDaily = ? WHERE userid = ?`, [Date.now(), userid]);
            db.run(`UPDATE data SET Money = ? WHERE userid = ?`, [row.Money + 300, userid]);
          }
        }
    });
  })
};

// Help Object
module.exports.help = {
    name: "daily",
    description: "",
    usage: "",
    category: "RPG",
    aliases: ["dai"]
};
