const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { sleep } = require("../utils/u");
const Dungeon = require('../Classes/Dungeon');
const Wolf = require('../Classes/Enemies/Wolf');
const PlayerDungeon = require("../Classes/PlayerDungeon");
const Zombie = require("../Classes/Enemies/Zombie");

module.exports = async function(client, interaction) {
    const con = client.connection;
    const playerDB = await client.getPlayer(con, interaction.user.id);

    let ATKbutton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji("1065891721717751910").setCustomId("atk");
    let DEFbutton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji("1065891718383292426").setCustomId("def");

    let buttonRow = new ActionRowBuilder()
        .addComponents([ATKbutton, DEFbutton]);

    let creature = new Zombie();

    const combat = await interaction.editReply({ content: `Vous engagez le combat contre :\n__${creature.name}__\nHP : ${creature.maxHP}\nATK : ${creature.ATK}\nDEF : ${creature.DEF}`, components: [buttonRow], fetchReply: true });
    
    const collector = combat.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 60000 });

    let player = new PlayerDungeon(playerDB.data.HP, playerDB.data.ATK, playerDB.data.DEF);
    let dungeon = new Dungeon(collector, creature, player);

    collector.on('collect', async button => {
        if (button.user.id !== interaction.user.id) return button.reply({ content: lang.notTheAuthorOfTheInteraction, ephemeral: true });
        button.deferUpdate();
        
        switch (button.customId) {
            case "atk":
                collector.resetTimer({ time: 60000 });
                dungeon.playerTurn(con, interaction, ATKbutton, DEFbutton, buttonRow, "atk");
                if (creature.isDead()) break;
                await sleep(2000);
                dungeon.NPCturn(con, interaction, ATKbutton, DEFbutton, buttonRow, "atk");
                break;

            case "def":
                collector.resetTimer({ time: 60000 });
                dungeon.playerTurn(con, interaction, ATKbutton, DEFbutton, buttonRow, "def");
                if (creature.isDead()) break;
                await sleep(2000);
                dungeon.NPCturn(con, interaction, ATKbutton, DEFbutton, buttonRow, "def");
                break;
        } //end switch button.id
    }); //end collected.on
}