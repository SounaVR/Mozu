const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports.run = (bot, message, args) => {

	const embed = new MessageEmbed()
		.setColor("#2C2F33")
		.setAuthor(`Commandes de ${bot.user.username}`, bot.user.displayAvatarURL())
		.setFooter(`Demandé par ${message.author.tag} à`, message.author.displayAvatarURL())
		.setTimestamp();
	if (args[0]) {
		let command = args[0];
		let cmd;
		if (bot.commands.has(command)) {
			cmd = bot.commands.get(command);
		}
		else if (bot.aliases.has(command)) {
			cmd = bot.commands.get(bot.aliases.get(command));
		}
		if(!cmd) return message.channel.send(embed.setTitle("Commande invalide.").setDescription(`Faites \`${bot.config.prefix}help\` pour la liste de toutes les commandes.`));
		command = cmd.help;
		//embed.setTitle(`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} command help`);
		embed.setDescription([
			`\`<>\` veut dire que c'est nécessaire, et \`()\` que c'est optionnel`,
			`❯ **Commande:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`❯ **Description:** ${command.description || "Aucune description fournie"}`,
			`❯ **Utilisation:** ${command.usage ? `\`${bot.config.prefix}${command.name} ${command.usage}\`` : "Pas d'utilisation"} `,
			`❯ **Alias:** ${command.aliases ? command.aliases.join(", ") : "Aucun"}`,
			`❯ **Catégorie:** ${command.category ? command.category : "General" || "Misc"}`,
		].join("\n"));

		return message.channel.send(embed);
	}
	const categories = readdirSync("./commands/");
	embed.setDescription([
		`Commandes disponibles pour ${bot.user.username}.`,
		`Le préfix du bot est **${bot.config.prefix}**`,
	].join("\n"));
	categories.forEach(category => {
		const dir = bot.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

		try {
			if (dir.size === 0) return;
			if (bot.config.owners.includes(message.author.id)) embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
			else if (category !== "Dev") embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
		}
		catch (e) {
			return catchErr(err, message)
		}
	});
	return message.channel.send(embed);
};

module.exports.help = {
	name: "help",
	description: "Commande help pour voir les commandes",
	usage: "(nom de la commande)",
	category: "Infos",
	aliases: ["h"]
};
