exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
  if (!client.config.owners.includes(message.author.id)) return message.react("❌");
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send("You are not registered, please do the `m!profile` command to remedy this.");

    const someone = message.mentions.members.first();

    var member = await getUser(con, someone.id);

    if (!someone) return message.react("❌");

    if (args[1] === "set") {
        if (!args[2]) return message.react("❌");
        if (!args[3]) return message.react("❌");

        con.query(`UPDATE data SET ${args[2]} = ${args[3]} WHERE userid = ${someone.id}`);
        return message.react("✅");
    } else if (args[1] === "add") {
        if (!args[2]) return message.react("❌");
        if (!args[3]) return message.react("❌");

        con.query(`UPDATE data SET ${args[2]} = ${member.data[args[2]] + Number(args[3])} WHERE userid = ${someone.id}`);
        return message.react("✅");
    } else return message.react("❌");
};//✅ ❌

exports.help = {
    name: "cheat",
    description_fr: "🕵️",
    description_en: "🕵️",
    usage_fr: "<@utilisateur> <set/add> <donnée> <nombre>",
    usage_en: "<@user> <set/add> <data> <number>",
    category: "Staff",
    aliases: ["super", "ez"]
};
