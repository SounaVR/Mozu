const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const Dungeon = require('../Classes/Dungeon');
const Wolf = require('../Classes/Enemies/Wolf');
const PlayerDungeon = require('../Classes/PlayerDungeon');
const Player = require('../Classes/Player');
const Zombie = require('../Classes/Enemies/Zombie');

module.exports = async function(client, interaction) {
    const con = client.connection;
    const playerDB = await client.getPlayer(interaction.user.id);

    const ATKbutton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji("1065891721717751910").setCustomId("atk");
    const DEFbutton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji("1065891718383292426").setCustomId("def");

    const buttonRow = new ActionRowBuilder()
        .addComponents([ATKbutton, DEFbutton]);

    const creature = new Wolf();

    const combat = await interaction.editReply({ content: `Vous engagez le combat contre :\n${creature.getStatus()}`, components: [buttonRow], fetchReply: true });

    const collector = combat.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 60000 });

    const player = new PlayerDungeon(playerDB.data.HP, Player.getMaxHP(playerDB), playerDB.data.ATK, playerDB.data.DEF);
    const dungeon = new Dungeon(collector, creature, player);

    collector.on('collect', async button => {
        if (button.user.id !== interaction.user.id) return button.reply({ content: lang.notTheAuthorOfTheInteraction, ephemeral: true });
        button.deferUpdate();

        switch (button.customId) {
            case "atk":
                collector.resetTimer({ time: 60000 });
                dungeon.playerTurn(interaction, ATKbutton, DEFbutton, buttonRow, "atk");
                if (creature.isDead()) break;
                await client.sleep(2000);
                dungeon.NPCturn(con, interaction, ATKbutton, DEFbutton, buttonRow, "atk");
                break;

            case "def":
                collector.resetTimer({ time: 60000 });
                dungeon.playerTurn(interaction, ATKbutton, DEFbutton, buttonRow, "def");
                if (creature.isDead()) break;
                await client.sleep(2000);
                dungeon.NPCturn(con, interaction, ATKbutton, DEFbutton, buttonRow, "def");
                break;
        }
    });

    collector.on('end', async () => {
        player.die(con, interaction, collector, dungeon.creature.name);
    });
}