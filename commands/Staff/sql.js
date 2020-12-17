module.exports.run = async (client, message, args, getPlayer) => {
  if (message.author.id !== "436310611748454401") return;

  var con = client.connection
  var player = await getPlayer(con, message.author.id);

  con.query(args.join(" "), function (err, result) {
    if (err) throw err;
    message.channel.send("OkPacket " + JSON.stringify(result, null, "   "));
  });
};

module.exports.help = {
  name: "sql",
  description_fr: "Modifie la base de données",
  description_en: "Modify the database",
  category: "Staff"
};
