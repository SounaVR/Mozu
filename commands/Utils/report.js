const Discord = require("discord.js");

exports.run = async (client, message, args, getPlayer, getUser) => {

    if (!args[0]) return message.channel.send("Correct usage : `m!report [error/problem]`")
    const text = args.join(" ");
    message.delete();
    const chann = client.channels.cache.find(channel => channel.id === "808240888353390592");
    const sicon = message.author.displayAvatarURL();

    const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, sicon)
        .setColor("#E6E6FA")
        .addField("Suggestion", text)
        .setFooter(`ID : ${message.author.id}`)
        .setTimestamp(message.createdAt);

    chann.send("<@436310611748454401>");
    chann.send(embed);

    message.reply("\n:warning: :flag_fr: Tout abus sera sévèrement puni !\n:warning: :flag_gb: Any abuse will be severely punished !")
    .then(e => {
        e.delete({ timeout: 15000 })
    })
};

exports.help = {
    name: "report",
    description_fr: "Pour signaler un bug/une erreur ou autre sur le bot au développeur",
    description_en: "To report a bug/error or other on the bot to the developer",
    category: "Utils",
    usage_fr: "(votre_bug)",
    usage_en: "(your_problem)"
};
