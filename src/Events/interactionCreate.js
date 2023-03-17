const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {
		if (!interaction.isCommand()) return;
		const player = await client.getPlayer(interaction.user.id);

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			if (player) {
				const Items = require(`../utils/Items/${player.data.lang}.json`);
				const maxEnergy = Items.objects.ring[player.items.ring].energy;
				const maxHP = 50;
				const energyCooldown = player.data.energyCooldown;
				const hpCooldown = player.data.hpCooldown;
				await client.query(`UPDATE stats SET cmd = ${player.stats.cmd + Number(1)} WHERE userid = ${interaction.user.id}`);
	
				if ((Date.now() - player.data.lastActivity) - energyCooldown > 0 && (Date.now() - player.data.lastActivity) - hpCooldown > 0) {
					const timeObj = Date.now() - player.data.lastActivity;
					const energy = Math.floor(timeObj / energyCooldown);
					const hp = Math.floor(timeObj / hpCooldown);
			
					player.ress.energy = (player.ress.energy || 0) + energy;
					player.data.HP = (player.data.HP || 0) + hp;
					if (player.ress.energy > maxEnergy) player.ress.energy = maxEnergy;
					if (player.data.HP > maxHP) player.data.HP = maxHP;
					await client.query(`UPDATE ress SET energy = ${player.ress.energy} WHERE userid = ${interaction.user.id}`);
					await client.query(`UPDATE data SET lastActivity = ${Date.now()}, HP = ${player.data.HP} WHERE userid = ${interaction.user.id}`);
				}
			} else if (!player && interaction.commandName !== "profile") {
				return interaction.reply(client.Default.notRegistered);
			}

			await command.execute(client, interaction);		
		} catch (error) {
			console.error(error);
		}
	},
};
