const manageProspecting = require('../../functions/manageProspecting');
const Discord           = require('discord.js'),
    Emotes              = require('../../utils/emotes.json'),
    Default             = require('../../utils/default.json');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    const prospectEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle(`${lang.prospect.title}`)
        .attachFiles(["./utils/images/prospect/gem.png"])
        .setThumbnail("attachment://gem.png")
        .addField("Description", `${lang.prospect.description.replace("%s", client.config.prefix)}`)
        .addField("Documentation", `${lang.prospect.doc}10k ${Emotes.ressource} = 1 ${Emotes.gem}\n\n${Emotes.stone} => ${Emotes.sapphire} +1 Power\n${Emotes.coal} => ${Emotes.amber} -1 sec on energy cooldown\n${Emotes.copper} => ${Emotes.citrine} +1 Mana Max\n${Emotes.iron} => ${Emotes.ruby} +1 HP Max\n${Emotes.gold} => ${Emotes.jade} +1 ATK\n${Emotes.malachite} => ${Emotes.amethyst} +1 DEF`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    if (!args[1]) {
        args[1] = 1
    }

    switch (args[0]) {
        case "stone":
            return manageProspecting(client, con, player, message, "stone", args[1], "sapphire", "+Power");
        case "coal":
            return manageProspecting(client, con, player, message, "coal", args[1], "amber", "-energy cooldown");
        case "copper":
            return manageProspecting(client, con, player, message, "copper", args[1], "citrine", "+Mana Max");
        case "iron":
            return manageProspecting(client, con, player, message, "iron", args[1], "ruby", "+HP Max");
        case "gold":
            return manageProspecting(client, con, player, message, "gold", args[1], "jade", "+ATK");
        case "malachite":
            return manageProspecting(client, con, player, message, "malachite", args[1], "amethyst", "+DEF");
        default:
            return message.channel.send({ embeds: [prospectEmbed] });
    }
};

exports.help = {
    name: "prospect",
    description_fr: "Cherche des gemmes précieuses dans 10 000 minerais d'un métal de faible valeur. Cela détruira les minerais.",
    description_en: "Look for precious gems in 10 000 ores of a low value metal. This will destroy the ores.",
    usage_fr: "<minerai> <quantité>",
    usage_en: "<ore> <quantity>",
    category: "RPG",
    aliases: ["pros", "prospection"]
};
