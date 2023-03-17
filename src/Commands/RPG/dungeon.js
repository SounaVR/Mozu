const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const manageDungeon = require('../../functions/manageDungeon.js');

module.exports = {
    data: {
        name: 'dungeon',
        nameLocalizations: {
            fr: 'donjon'
        },
        description: 'omagad is it DONJONS ?',
        descriptionLocalizations: {
            fr: 'omagad is it DONJONS ?'
        }
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const player = await client.getPlayer(interaction.user.id);
        const react = ["1065891789506093078", "1065891556093067315"];
        
        let validButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setEmoji(react[0]).setCustomId('valid');
        let cancelButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji(react[1]).setCustomId('cancel');

        let buttonRow = new ActionRowBuilder()
            .addComponents([validButton, cancelButton]);

        if (player.data.HP == 0) return interaction.reply("Vous n'avez pas assez de points de vie pour lancer un donjon.");
        
        const msg = await interaction.reply({ content: "Désirez-vous entrer dans le donjon ?", components: [buttonRow], fetchReply: true });

        const collector = msg.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 30000 });

        collector.on('collect', async button => {
            if (button.user.id !== interaction.user.id) return button.reply({ content: lang.notTheAuthorOfTheInteraction, ephemeral: true });

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