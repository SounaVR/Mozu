exports.run = async (client, message, args, getPlayer, getUser) => {
  if (!client.config.owners.includes(message.author.id)) return message.react("❌");
    var con = client.connection

    const someone = message.mentions.members.first();

    var member = await getUser(con, someone.id);

    if (!someone) return message.react("❌");

    if (args[1] === "set") {
        if (!args[3]) return message.react("❌");
        if (!args[4]) return message.react("❌");

        switch (args[2]) {
            case "data": case "ress": case "items": case "enchant": case "prospect": case "stats":
                con.query(`UPDATE ${args[2]} SET ${args[3]} = ${args[4]} WHERE userid = ${someone.id}`);
                break;
        }
        return message.react("✅");
    } else if (args[1] === "add") {
        if (!args[2]) return message.react("❌");
        if (!args[3]) return message.react("❌");

        switch (args[2]) {
            case "data": case "ress": case "items": case "enchant": case "prospect": case "stats":
                con.query(`UPDATE ${args[2]} SET ${args[3]} = ${member[args[2]][args[3]] + Number(args[4])} WHERE userid = ${someone.id}`);
                break;
        }
        return message.react("✅");
    } else return message.react("❌");
};//✅ ❌

exports.help = {
    name: "cheat",
    description_fr: "🕵️",
    description_en: "🕵️",
    usage_fr: "<@utilisateur> <set/add> <table> <donnée> <nombre>",
    usage_en: "<@user> <set/add> <table> <data> <number>",
    category: "Staff",
    aliases: ["super", "ez"]
};
