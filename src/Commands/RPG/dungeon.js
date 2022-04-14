const { MessageButton, MessageActionRow } = require('discord.js');
const Default = require('../../../utils/default.json'),
manageDungeon = require('../../../functions/manageDungeon.js');

module.exports = {
    name: 'dungeon',
    description: 'c\'est les donjons coucou',
    async execute(client, interaction) {
        const con = client.connection;
        const player = await client.getPlayer(con, interaction.user.id);
        if (!player) return interaction.reply(`${Default.notRegistered}`);
        const react = ["780222056007991347", "780222833808506920"];
        
        let validButton = new MessageButton().setStyle('SUCCESS').setEmoji(react[0]).setCustomId('valid');
        let cancelButton = new MessageButton().setStyle('DANGER').setEmoji(react[1]).setCustomId('cancel');

        let buttonRow = new MessageActionRow()
            .addComponents([validButton, cancelButton]);

        if (player.data.HP == 0) return interaction.reply("Vous n'avez pas assez de points de vie pour lancer un donjon.");
        
        const msg = await interaction.reply({ content: "Désirez-vous entrer dans le donjon ?", components: [buttonRow], fetchReply: true });

        const filter = (interact) => interact.user.id === interaction.user.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async button => {
            button.deferUpdate();
            switch (button.customId) {
                case 'valid':
                    manageDungeon(client, interaction);
                    collector.stop();
                    break;
            
                case 'cancel':
                    interaction.editReply({ content: "Vous n'êtes finalement pas entré dans le donjon.", components: [] })
                    collector.stop();
                    break;
            }
        });
    }
}

//m!dungeon => tu veux entrer dans le donjon ?
//accept reaction => vous engagez le combat contre [creature]
//(voir plus tard) si c'est pas une embuscade, alors, le joueur commence. Sinon, la créature commence. | calcul de la probabilité de l'embuscade
//Si le joueur timeout => c'est le tour de la créature (on retire des hp au joueur) => puis tour au joueur s'il est pas mort
//Si le joueur appuie sur le bouton => on enlève les HP à la créature => puis au tour de la créature si elle meurt pas
//Si elle meurt => étage suivant (quand il y a plus de créatures)
//Mais, si le joueur meurt => le donjon est terminé.

//vu qu'on reset le timer à chaque click, on met le tour de la créature dans le collector.on('end') et on reset (si possible)

// Witch
// Zombie
// Orc
// Troll
// Humain
// Archer
// Lancier
// Rat
// Slime
// Bear
// Snake
// Crocodile
// Mage
// Boar
// Gobelin
// Worgen

// 21 ATK
// 22 DEF