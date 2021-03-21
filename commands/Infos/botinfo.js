require("moment-duration-format");
const { checkDays } = require('../../utils/u.js');
const Discord       = require("discord.js"),
    moment 	      	= require("moment");

exports.run = async (client, message, args, getPlayer, getUser) => {
	const con = client.connection;
	con.query(`SELECT COUNT(*) AS usersCount FROM data`, function (err, rows, fields) {
		if (err) throw err;

		const duration = moment.duration(client.uptime).format("D [days], HH [hrs], m [mins], s [secs]");
		const test = moment(client.user.createdAt).format("DD/MM/YYYY");
		let bicon = client.user.avatarURL();
		let botembed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.username}`, bicon)
			.setColor(message.member.displayColor)
			.setThumbnail(bicon)
			.addField("Creator", "Souna#2424", true)
			.addField("Servers", `${client.guilds.cache.size} servers`, true)

			.addField("Users", `${client.users.cache.size} users`, true)
			.addField("Players", `${rows[0].usersCount} players`, true)

			.addField("Uptime", duration, true)
			.addField("Library", "discord.js", true)

			.addField("Memory used", Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + " Mb", true)
			.addField("My link", "[Don't click](https://cdn.discordapp.com/attachments/657298202688749579/686932751881994266/non.jpg)", true)
			.addField("Creation Date", `${test}\n(${checkDays(client.user.createdAt)})`, true)

			.setFooter(`${client.user.username}`, client.user.avatarURL())
			.setTimestamp();
		message.channel.send(botembed);
	});
};

exports.help = {
	name: "botinfo",
	description_fr: "Affiche des informations sur le bot",
	description_en: "Displays information about the bot",
	category: "Infos",
	aliases: ["bi"]
};
