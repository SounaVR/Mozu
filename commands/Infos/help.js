const { MessageEmbed } = require("discord.js");
const { readdirSync }  = require("fs");
const Default          = require("../../utils/default.json");

exports.run = async (client, message, args, getPlayer, getUser) => {
	const con = client.connection;
	const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
	const lang = require(`../../utils/text/${player.data.lang}.json`);

	const embed = new MessageEmbed()
		.setColor(message.member.displayColor)
		.setAuthor(`${lang.help.embedTitle.replace("%u", client.user.username)}`, client.user.displayAvatarURL())
		.setTimestamp()
		.setFooter(`${client.commands.size} commands`, "https://cdn.discordapp.com/emojis/864202410884857867.gif?v=1")

	if (args[0]) {
		let command = args[0];
		let cmd;
		if (client.commands.has(command)) {
			cmd = client.commands.get(command);
		} else if (client.aliases.has(command)) {
			cmd = client.commands.get(client.aliases.get(command));
		}

		if (!cmd) return message.channel.send(embed.setTitle(`${lang.help.invalidCommand}`).setDescription(`${lang.help.InvalidCommandField.replace("%s", `${client.config.prefix + "help"}`)}`));

		command = cmd.help;
		var description;
		var usage;

		switch (player.data.lang) {
			case "fr":
				description = command.description_fr
				usage = command.usage_fr
				break;
		
			default:
				description = command.description_en
				usage = command.usage_en
				break;
		}

		embed.setDescription([
			`${lang.help.infos}`,
			`❯ **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`❯ **Description:** ${description || lang.help.infos}`,
			`❯ **${lang.help.usage}:** ${usage ? `\`${client.config.prefix}${command.name} ${usage}\`` : lang.help.noUsage} `,
			`❯ **Alias:** ${command.aliases ? command.aliases.join(", ") : lang.help.noAliases}`,
			`❯ **${lang.help.category}:** ${command.category ? command.category : "General" || "Misc"}`,
		].join("\n"));

		return message.channel.send({ embeds: [embed] });
	}

	const categories = readdirSync("./commands/");

	embed.setDescription([
		`${lang.help.prefix.replace("%s", `**` + client.config.prefix)}**`,
		`${lang.help.helpMore.replace("%s", client.config.prefix)}`
	].join("\n"));
	
	categories.forEach(category => {
		const dir = client.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

		try {
			if (dir.size === 0) return;
			//if (client.config.owners.includes(message.author.id)) embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
			if (category !== "Staff") embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
		}
		catch (e) {
			return console.warn(e);
		}
	});
	return message.channel.send({ embeds: [embed] });
};

exports.help = {
	name: "help",
	description_fr: "Commande help pour voir les commandes",
	description_en: "Command help to see the commands",
	usage_fr: "(nom de la commande)",
	usage_en: "(command name)",
	category: "Infos",
	aliases: ["h", "aide"]
};
