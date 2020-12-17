const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports.run = async (client, message, args, getPlayer) => {
	var con = client.connection;
  	var player = await getPlayer(con, message.author.id);
	if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.");
	const lang = require(`../../utils/text/${player.data.lang}.json`);
  	const uname = message.author.tag;
  	const userid = message.author.id;

	const embed = new MessageEmbed()
		.setColor(message.member.displayColor)
		.setAuthor(`${lang.help2.author} ${client.user.username}`, client.user.displayAvatarURL())
		.setFooter(`${lang.help2.askby} ${message.author.tag}`, message.author.displayAvatarURL())
		.setTimestamp();
	if (args[0]) {
		let command = args[0];
		let cmd;
		if (client.commands.has(command)) {
			cmd = client.commands.get(command);
		}
		else if (client.aliases.has(command)) {
			cmd = client.commands.get(client.aliases.get(command));
		}
		if (!cmd) return message.channel.send(embed.setTitle(`${lang.help2.error}`).setDescription(`\`${client.config.prefix}help\` ${lang.help2.do}`));
		command = cmd.help;
		var description;
		var usage;
		if (player.data.lang === "fr") {
			description = command.description_fr
			usage = command.usage_fr
		} else {
			description = command.description_en
			usage = command.usage_en
		}
			embed.setDescription([
			`${lang.help2.info}`,
			`❯ **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`❯ **Description:** ${description || lang.help2.utilisation}`,
			`❯ **${lang.help2.usage}:** ${usage ? `\`${client.config.prefix}${command.name} ${usage}\`` : lang.help2.noUsage} `,
			`❯ **Alias:** ${command.aliases ? command.aliases.join(", ") : lang.help2.nothing}`,
			`❯ **${lang.help2.category}:** ${command.category ? command.category : "General" || "Misc"}`,
		].join("\n"));

		return message.channel.send(embed);
	}
	const categories = readdirSync("./commands/");
	embed.setDescription([
		`${lang.help2.available} ${client.user.username}.`,
		`${lang.help2.prefix} **${client.config.prefix}**`,
		`${lang.help2.helpMore}`
	].join("\n"));
	categories.forEach(category => {
		const dir = client.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

		try {
			if (dir.size === 0) return;
			if (client.config.owners.includes(message.author.id)) embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
			else if (category !== "Staff") embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
		}
		catch (e) {
			return catchErr(err, message)
		}
	});
	return message.channel.send(embed);
};

module.exports.help = {
	name: "help",
	description_fr: "Commande help pour voir les commandes",
	description_en: "Command help to see the commands",
	usage_fr: "(nom de la commande)",
	usage_en: "(command name)",
	category: "Infos",
	aliases: ["h"]
};
