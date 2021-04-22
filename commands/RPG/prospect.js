const manageProspecting = require('../../functions/manageProspecting');
const Discord           = require('discord.js'),
    Default             = require('../../utils/default.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    const prospectEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle(`${lang.prospect.title}`)
        .attachFiles(["./utils/images/gem_thumbnail_prospect.png"])
        .setThumbnail("attachment://gem_thumbnail_prospect.png")
        .addField("Description", `${lang.prospect.description}`)
        .addField("Documentation", `${lang.prospect.doc} [ stone/coal/copper/iron/gold/malachite ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());
    
    if (!args[1] && args[0]) {
        return message.channel.send(`${lang.prospect.specifyQuantity}`);
    }

    switch (args[0]) {
        case "stone":
            return manageProspecting(client, con, player, message, "stone", args[1], "sapphire");
        case "coal":
            return manageProspecting(client, con, player, message, "coal", args[1], "amber");
        case "copper":
            return manageProspecting(client, con, player, message, "copper", args[1], "citrine");
        case "iron":
            return manageProspecting(client, con, player, message, "iron", args[1], "ruby");
        case "gold":
            return manageProspecting(client, con, player, message, "gold", args[1], "jade");
        case "malachite":
            return manageProspecting(client, con, player, message, "malachite", args[1], "amethyst");
        default:
            return message.channel.send(prospectEmbed);
    }
};

exports.help = {
    name: "prospect",
    description_fr: "Cherche des gemmes précieuses dans 5 minerais d'un métal de faible valeur. Cela détruira les minerais.",
    description_en: "Look for precious gems in 5 ores of a low value metal. This will destroy the ores.",
    usage_fr: "<minerai> <quantité>",
    usage_en: "<ore> <quantity>",
    category: "RPG",
    aliases: ["pros", "prospection"]
};
