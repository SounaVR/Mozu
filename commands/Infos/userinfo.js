/**
 * @author Nickname
 * @file commandfileexample.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
  return message.channel.send("nope")
//   const moment = require('moment');
//   const Discord = require('discord.js');
//   //const { trimArray } = require('../../util/Util');
//   const activities = {
//   	PLAYING: 'Playing',
//   	STREAMING: 'Streaming',
//   	WATCHING: 'Watching',
//   	LISTENING: 'Listening to'
//   };
//   const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
//   		const embed = new Discord.RichEmbed()
//   			.setThumbnail(user.displayAvatarURL)
//   			.addField('❯ Name', user.tag, true)
//   			.addField('❯ ID', user.id, true)
//   			.addField('❯ Discord Join Date', moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A'), true)
//   			.addField('❯ Bot?', user.bot ? 'Yes' : 'No', true);
//   		if (message.author.channel.type === 'text') {
//   			try {
//   				const member = await message.author.guild.members.fetch(user.id);
//   				const roles = member.roles
//   					.filter(role => role.id !== message.author.guild.defaultRole.id)
//   					.sort((a, b) => b.position - a.position)
//   					.map(role => role.name);
//   				embed
//   					.setColor(member.displayHexColor)
//   					.setDescription(member.presence.activity
//   						? `${activities[member.presence.activity.type]} **${member.presence.activity.name}**`
//   						: '')
//   					.addField('❯ Server Join Date', moment.utc(member.joinedAt).format('MM/DD/YYYY h:mm A'), true)
//   					.addField('❯ Nickname', member.nickname || 'None', true)
//   					.addField('❯ Highest Role',
//   						member.roles.highest.id === message.author.guild.defaultRole.id ? 'None' : member.roles.highest.name, true)
//   					.addField('❯ Hoist Role', member.roles.hoist ? member.roles.hoist.name : 'None', true)
//   					//.addField(`❯ Roles (${roles.length})`, roles.length ? trimArray(roles, 10).join(', ') : 'None');
//   			} catch (err) {
//   				embed.setFooter('Failed to resolve member, showing basic user information instead.');
//   			}
//   		}
//   		return message.channel.send(embed);
//
};

// Help Object
module.exports.help = {
  name: "userinfo",
  description: "Affiche des informations sur l'utilisateur",
  usage: "(@user)",
  category: "Infos",
  aliases: ["ui"]
};
