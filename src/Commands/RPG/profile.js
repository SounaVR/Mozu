const { EmbedBuilder } = require('discord.js');
const insert_data = require('../../functions/insert/insert_data'),
    insert_enchant = require('../../functions/insert/insert_enchant'),
    insert_items = require('../../functions/insert/insert_items'),
    insert_prospect = require('../../functions/insert/insert_prospect'),
    insert_ress = require('../../functions/insert/insert_ress'),
    insert_slots = require('../../functions/insert/insert_slots'),
    insert_stats = require('../../functions/insert/insert_stats');

module.exports = {
    data: {
        name: "profile",
        description: "Display your profile.",
        nameLocalizations: {
            fr: "profil"
        },
        descriptionLocalizations: {
            fr: "Affiche votre profil."
        }
    },
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const { user } = interaction;
        const databaselogs = client.channels.cache.find(ch => ch.id === '1065830709652103168');
        
        const userid = user.id;
        const con = client.connection;
        const player = await client.getPlayer(userid);
        
        if (!player) {
            insert_data(client, con, player, interaction, databaselogs, userid);
            insert_enchant(client, con, player, interaction, databaselogs, userid);
            insert_items(client, con, player, interaction, databaselogs, userid);
            insert_prospect(client, con, player, interaction, databaselogs, userid);
            insert_ress(client, con, player, interaction, databaselogs, userid);
            insert_slots(client, con, player, interaction, databaselogs, userid);
            insert_stats(client, con, player, interaction, databaselogs, userid);
            
            interaction.reply("You are now registered. Enjoy !\nYou can change your language with `/lang`.")
        } else {
            const badges = JSON.parse(player.data.badges).badges;
            const badgesArray = [];
            if (badges) {
                badges.forEach(badge => {
                    badgesArray.push(client.Default.badges[badge])
                });
            }

            const embed = new EmbedBuilder()
                .setAuthor({ name: user.tag, value: user.displayAvatarURL() })
                .addFields(
                    { name: "Informations", value: `:notepad_spiral: Title : null\n${client.Emotes.trophy}Achievement Point : X`, inline: true },
                    { name: `Badges (${badges.length || 0})`, value: `${badgesArray.join("") || " "}` , inline: true },
                    { name: "Other stats", value: `Claimed Daily: ${player.stats.daily}\nClaimed Hourly: ${player.stats.HR}\nExecuted Commands: ${player.stats.cmd}`, inline: true },
                    { name: "Ornement", value: "X" }
                )
                // .attachFiles(["./utils/images/ornement.png"])
                // .setImage("attachment://ornement.png")
                .setFooter({ text: `#${player.stats.uuid}` }) 

            await interaction.reply({ embeds: [embed] })
        }
    }
}