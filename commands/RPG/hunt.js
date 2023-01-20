/**
 * @author ReallySouna
 * @file hunt.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
  const sqlite = require("sqlite3").verbose();
  const Discord = require("discord.js");
  const Default = require("../../utils/default.json");
  const Text = require("../../utils/text/fr.json")

  let userid = message.author.id;
  let uname = message.author.tag;
  let db = new sqlite.Database("./data/db.db", sqlite.OPEN_READWRITE);
  let queryD = 'SELECT * FROM data WHERE userid = ?';

};

// Help Object
module.exports.help = {
  name: "hunt",
  description: "Pour chasser des z'animaux",
  usage: "",
  category: "RPG",
  aliases: [""]
};
