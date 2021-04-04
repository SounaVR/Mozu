const Discord = require("discord.js");

exports.run = async (client, message, args, getPlayer, getUser) => {

    if (!args[0]) return message.channel.send("Correct usage : `m!suggestion [your idea]`");
    const text = args.join(" ");
    message.delete();
    const chann = client.channels.cache.find(channel => channel.id === "771360941341671444");
    const sicon = message.author.displayAvatarURL();

    const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, sicon)
        .setColor("#E6E6FA")
        .addField("Suggestion", text)
        .setFooter(`ID : ${message.author.id}`)
        .setTimestamp(message.createdAt);

    chann.send(embed).then(async e => {
        await e.react("✅");
        await e.react("❌");
    });

    message.reply("\n:warning: :flag_fr: Tout abus sera sévèrement puni !\n:warning: :flag_gb: Any abuse will be severely punished !")
    .then(e => {
        e.delete({ timeout: 15000 })
    })
};

exports.help = {
    name: "suggestion",
    description_fr: "Propose une idée au développeur",
    description_en: "Suggest an idea to the developer",
    usage_fr: "(votre_suggestion)",
    usage_en: "(your_suggestion)",
    category: "Utils",
    aliases: ["sugg", "sug"]
};
