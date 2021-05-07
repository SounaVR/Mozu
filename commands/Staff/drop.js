//
exports.run = async (client, message, args, getPlayer, getUser) => {
    if (message.author.id !== "436310611748454401") return message.react("❌");
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);

    if (!args[0]) return message.channel.send("Veuillez spécifier un joueur à supprimer.");

    await con.query(`DELETE FROM data WHERE userid = ${member.id}`);
    await con.query(`DELETE FROM enchant WHERE userid = ${member.id}`);
    await con.query(`DELETE FROM items WHERE userid = ${member.id}`);
    await con.query(`DELETE FROM prospect WHERE userid = ${member.id}`);
    await con.query(`DELETE FROM ress WHERE userid = ${member.id}`);
    await con.query(`DELETE FROM slots WHERE userid = ${member.id}`);
    await con.query(`DELETE FROM stats WHERE userid = ${member.id}`);

    message.channel.send(`${member}/${member.id} a bien été clear.`);
};

exports.help = {
    name: "drop",
    description_fr: "Supprime un joueur de la base de données",
    description_en: "Delete a player from the database",
    category: "Staff"
};