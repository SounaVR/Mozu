const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {
		if (!interaction.isCommand()) return;
		const con = client.connection;
		const player = await client.getPlayer(con, interaction.user.id);

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			if (player) {
				const Items = require(`../utils/Items/${player.data.lang}.json`);
				const maxEnergy = Items.objects.ring[player.items.ring].energy;
				const energyCooldown = player.data.energyCooldown;
				con.query(`UPDATE stats SET cmd = ${player.stats.cmd + Number(1)} WHERE userid = ${interaction.user.id}`);
	
				if ((Date.now() - player.data.lastActivity) - energyCooldown > 0) {
					const timeObj = Date.now() - player.data.lastActivity;
					const gagnees = Math.floor(timeObj / energyCooldown);
			
					player.ress.energy = (player.ress.energy || 0) + gagnees;
					if (player.ress.energy > maxEnergy) player.ress.energy = maxEnergy;
					con.query(`UPDATE ress SET energy = ${player.ress.energy} WHERE userid = ${interaction.user.id}`);
					con.query(`UPDATE data SET lastActivity = ${Date.now()} WHERE userid = ${interaction.user.id}`);
				}
			} else if (!player && !interaction.commandName === "profile") {
				return interaction.reply(client.Default.notRegistered);
			}

			await command.execute(client, interaction);		
		} catch (error) {
			console.error(error);
		}
	},
};
