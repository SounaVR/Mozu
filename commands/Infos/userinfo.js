const { checkDays } = require('../../utils/u.js');
const Discord       = require('discord.js'),
    moment          = require('moment');

exports.run = async (client, message, args, getPlayer, getUser) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    if (member) {
    const embed = new Discord.MessageEmbed()
        .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
        .setColor(message.member.displayColor)
        .setThumbnail(member.user.displayAvatarURL())
        .addField('Created On', `${moment.utc(member.user.createdAt).format("DD/MM/YYYY")} (${checkDays(member.user.createdAt)})`, true)
        .addField('Joined On', `${moment.utc(member.user.joinedAt || member.joinedAt).format("DD/MM/YYYY")} (${checkDays(member.user.joinedAt || member.joinedAt)})`, true)
        .addField("Nickname", `${member.nickname != null ? `${member.nickname}` : 'None'}`)
    message.channel.send(embed);
    }
}
// Help Object
exports.help = {
    name: "userinfo",
    description_fr: "Affiche des informations sur l'utilisateur",
    description_en: "Displays user information",
    usage_fr: "(@quelqu'un)",
    usage_en: "(@someone)",
    category: "Infos",
    aliases: ["ui"]
};
