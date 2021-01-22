const Discord = require("discord.js");

module.exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    let server = message.guild.id;

    if (server === "689471316570406914") {
        const text = args.join(" ");
        message.delete();
        var chann = client.channels.cache.find(channel => channel.id === "771360941341671444");
        let sicon = message.author.displayAvatarURL();

        let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, sicon)
        .setColor("#E6E6FA")
        .addField("Suggestion", text)
        .setFooter(`ID : ${message.author.id}`)
        .setTimestamp(message.createdAt);
        chann.send("<@&689881923912335406>");
        chann.send(embed).then(async e => {
            await e.react("✅");
            await e.react("❌");
        });

        message.reply("\n:warning: :flag_fr: Tout abus sera sévèrement puni !\n:warning: :flag_gb: Any abuse will be severely punished !")
        .then(e => {
            e.delete({ timeout: 15000 })
        })
    } else {
        message.reply("vous devez être dans le serveur de support pour proposer votre idée (m!server).");
    }
};

module.exports.help = {
    name: "suggestion",
    description_fr: "Propose une idée au développeur",
    description_en: "Suggest an idea to the developer",
    category: "Utils",
    aliases: ["sugg", "sug"]
};
