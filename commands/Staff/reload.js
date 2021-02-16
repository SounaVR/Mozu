const { readdirSync } = require("fs");
const { join } = require("path");

exports.run = (client, message, args, getPlayer, getUser) => {
	if (!client.config.owners.includes(message.author.id)) return message.react("❌");

	if (!args[0]) return message.channel.send("Veuillez indiquer une commande !");
	const commandName = args[0].toLowerCase();
	const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
	if (!command) return message.channel.send("Cette commande n'existe pas.");
	readdirSync(join(__dirname, "..")).forEach(f => {
		const files = readdirSync(join(__dirname, "..", f));
		if (files.includes(`${commandName}.js`)) {
			const file = `../${f}/${commandName}.js`;
			try {
				delete require.cache[require.resolve(file)];
				client.commands.delete(commandName);
				const pull = require(file);
				client.commands.set(commandName, pull);
				return message.channel.send(`\`${commandName}.js\` a bien été réinitialisée !`).then(e => {
				});
			}
			catch (err) {
				message.channel.send(`Could not reload: \`${args[0].toUpperCase()}\``).then(e => {
				});
			}
		}
	});
};

exports.help = {
	name: "reload",
	description_fr: "Redémarre une commande",
	description_en: "Restarts a command",
	usage_fr: "<nom de la commande>",
	usage_en: "<command name>",
	category: "Staff",
	aliases: ["re", "r"]
};
