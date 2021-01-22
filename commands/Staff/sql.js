exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
  if (message.author.id !== "436310611748454401") return message.react("❌");

  var con = client.connection

  con.query(args.join(" "), function (err, result) {
    if (err) throw err;
    message.channel.send("OkPacket " + JSON.stringify(result, null, "   "));
  });
};

exports.help = {
  name: "sql",
  description_fr: "Modifie la base de données",
  description_en: "Modify the database",
  category: "Staff"
};
