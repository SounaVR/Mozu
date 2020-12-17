const Default = require("../../utils/default.json")
const Discord = require('discord.js');

module.exports.run = async (client, message, args, getPlayer) => {
  if (!client.config.owners.includes(message.author.id)) return;


  var con = client.connection
  var player = await getPlayer(con, message.author.id);

  //const lang = require(`../../utils/text/${player.data.lang}.json`);

  //message.channel.send(`${lang.bvn1}`);
  //message.channel.send(player.data.lang);

  //const userid = message.author.id;

  // var user = player.data.lang;
  //
  // con.query(`SELECT COUNT(*) AS usersCount FROM data`, function(err, rows, fields) {
  //   if (err) throw err;
  //   message.channel.send(`${rows[0].usersCount}`)
  // })

};

module.exports.help = {
  name: "test",
  description_fr: "commande test",
  description_en: "test command",
  category: "Staff"
};
