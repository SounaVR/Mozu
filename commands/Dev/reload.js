const { readdirSync } = require("fs");
const { join } = require("path");

module.exports.run = (bot, message, args) => {

	if (!bot.config.owners.includes(message.author.id)) return;

	message.delete();
	if (!args[0]) return message.channel.send("Veuillez indiquer une commande !");
	const commandName = args[0].toLowerCase();
	const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));
	if (!command) return message.channel.send("Cette commande n'existe pas.").then(e => {
		e.delete();
	});
	readdirSync(join(__dirname, "..")).forEach(f => {
		const files = readdirSync(join(__dirname, "..", f));
		if (files.includes(`${commandName}.js`)) {
			const file = `../${f}/${commandName}.js`;
			try {
				delete require.cache[require.resolve(file)];
				bot.commands.delete(commandName);
				const pull = require(file);
				bot.commands.set(commandName, pull);
				return message.channel.send(`${commandName}.js a bien été réinitialisée!`).then(e => {
					e.delete();
				});
			}
			catch (err) {
				message.channel.send(`Could not reload: ${args[0].toUpperCase()}\``).then(e => {
					e.delete();
				});
				return catchErr(err, message)
			}
		}
	});
};

module.exports.help = {
	name: "reload",
	aliases: ["re"],
	description: "Redémarre une commande",
	usage: "<nom de la commande>",
	category: "Dev",
};
