const Discord = require('discord.js'),
    Emotes    = require('../../utils/emotes.json');

const insert_data = require('../../functions/insert/insert_data'),
    insert_enchant = require('../../functions/insert/insert_enchant'),
    insert_items = require('../../functions/insert/insert_items'),
    insert_prospect = require('../../functions/insert/insert_prospect'),
    insert_ress = require('../../functions/insert/insert_ress'),
    insert_slots = require('../../functions/insert/insert_slots'),
    insert_stats = require('../../functions/insert/insert_stats');

exports.run = async (client, message, args, getPlayer, getUser) => {
    const databaselogs = client.channels.cache.find(channel => channel.id === "827453945131696139");

    const user = message.mentions.users.first() || message.author;
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    const member = await getUser(con, user.id);
    const userid = message.author.id;

    if (!player) {
        insert_data(client, con, player, message, databaselogs, userid);
        insert_enchant(client, con, player, message, databaselogs, userid);
        insert_items(client, con, player, message, databaselogs, userid);
        insert_prospect(client, con, player, message, databaselogs, userid);
        insert_ress(client, con, player, message, databaselogs, userid);
        insert_slots(client, con, player, message, databaselogs, userid);
        insert_stats(client, con, player, message, databaselogs, userid);
        
        message.channel.send("You are now registered. Enjoy !\n*Do `m!help` to display the list of commands and you can change your language with `m!lang`*.")
    } else {
        if (user && !member) return message.reply(`this user is not registered !`)
        const embed = new Discord.MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .addField("informations", `
            :notepad_spiral: Titre : null\n${Emotes.trophy}Points de succès : X`, true)
            .addField("Badges (X)", `
            <a:sexxx:800109145889964053>`, true)
            .addField("Other stats", `
            Commandes effectuées : ${member.stats.cmd}`, true)
            .addField("Ornement", "X")
            // .attachFiles(["./utils/images/ornement.png"])
            // .setImage("attachment://ornement.png")
            .setFooter(`#${member.stats.uuid}`)

        message.channel.send({ embeds: [embed] })
    }
};

exports.help = {
    name: "profile",
    description_fr: "Affiche votre profil",
    description_en: "Display your profile",
    category: "RPG",
    aliases: ["profil", "p"]
};
