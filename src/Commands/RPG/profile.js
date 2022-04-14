const insert_data = require('../../../functions/insert/insert_data'),
insert_enchant = require('../../../functions/insert/insert_enchant'),
insert_items = require('../../../functions/insert/insert_items'),
insert_prospect = require('../../../functions/insert/insert_prospect'),
insert_ress = require('../../../functions/insert/insert_ress'),
insert_slots = require('../../../functions/insert/insert_slots'),
insert_stats = require('../../../functions/insert/insert_stats');

module.exports = {
    name: 'profile',
    description: 'Affiche votre profil',
    async execute(client, interaction, getPlayer, getUser) {
        const databaselogs = client.channels.cache.find(ch => ch.id === '933134644717707374');

        const { user } = interaction;
        const userid = user.id;
        const con = client.connection;
        const player = await getPlayer(con, userid);
        
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
            interaction.reply('le profil est pas encore fait :) mais t\'es déjà inscrit du coup vu que j\'envoie ça bg')
        }
    }
}
    // const user = message.mentions.users.first() || message.author;
    // const member = await getUser(con, user.id);


    //  else {
    //     if (user && !member) return message.reply(`this user is not registered !`)
    //     const embed = new Discord.MessageEmbed()
    //         .setAuthor(user.tag, user.displayAvatarURL())
    //         .addField("informations", `
    //         :notepad_spiral: Titre : null\n${Emotes.trophy}Points de succès : X`, true)
    //         .addField("Badges (X)", `
    //         <a:sexxx:800109145889964053>`, true)
    //         .addField("Other stats", `
    //         Commandes effectuées : ${member.stats.cmd}`, true)
    //         .addField("Ornement", "X")
    //         // .attachFiles(["./utils/images/ornement.png"])
    //         // .setImage("attachment://ornement.png")
    //         .setFooter(`#${member.stats.uuid}`)

    //     message.channel.send({ embeds: [embed] })