const { nFormatter } = require('../../utils/u');
const Discord = require('discord.js'),
    Emotes    = require('../../utils/emotes.json'),
    Default   = require('../../utils/default.json');

async function manageProspecting(client, con, player, message, ore, quantity, gem) {
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const react = ['780222056007991347', '780222833808506920'];

    const embed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor);

    const getNeededRessource = quantity * 100;

    embed.setTitle(`Do you want to prospect that ?`)
    let txt = [];

    if (player.data[ore] < getNeededRessource) txt.push(`${Emotes[ore]} ${ore} : ${nFormatter(getNeededRessource)} (${Emotes.cancel} - Missing ${nFormatter(Math.floor(getNeededRessource-player.data[ore]))})`);
    if (player.data[ore] >= getNeededRessource) txt.push(`${Emotes[ore]} ${ore} : ${nFormatter(getNeededRessource)} (${Emotes.checked})`);

    embed.addField("**Cost**", txt);

    const msg = await message.channel.send(embed);

    await msg.react(react[0]);
    await msg.react(react[1]);

    const filter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;

    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
        let reaction = collected.first();

        switch(reaction.emoji.id) {
            case react[0]:
                msg.delete();
                let need = [];
                let resssql = [];

                if (player.data[ore] < getNeededRessource) need.push(`sorry bro`);
                resssql.push(`${ore} = ${ore} - ${getNeededRessource}`);

                if (need.length >= 1) return message.channel.send(`${lang.prospect.notEnoughRess}`);

                con.query(`UPDATE data SET ${resssql.join(',')}, ${gem} = ${player.data[gem] + Number(quantity)} WHERE userid = ${message.author.id}`);

                return message.channel.send(`${lang.prospect.success} : ${gem} x${quantity}`);

            case react[1]:
                msg.delete();
                return message.channel.send(`${lang.prospect.canceled}`);
        }
    }).catch(() => {
        msg.reactions.removeAll();
    });
}

exports.run = async (client, message, args, getPlayer, getUser) => {
    if (message.author.id !== "436310611748454401") return message.channel.send("Commande en maintenance.");
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    const prospectEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle(`${lang.prospect.title}`)
        .attachFiles(["./utils/images/gem_thumbnail_prospect.png"])
        .setThumbnail("attachment://gem_thumbnail_prospect.png")
        .addField("Description", `${lang.prospect.description}`)
        .addField("Documentation", `${lang.prospect.doc} [ stone/coal/copper/iron/gold/malachite ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());
    
    if (!args[1] && args[0]) {
        return message.channel.send(`${lang.prospect.specifyQuantity}`);
    }

    switch (args[0]) {
        case "stone":
            return manageProspecting(client, con, player, message, "stone", args[1], );
        case "coal":
            return manageProspecting(client, con, player, message, "coal", args[1], );
        case "copper":
            return manageProspecting(client, con, player, message, "copper", args[1], );
        case "iron":
            return manageProspecting(client, con, player, message, "iron", args[1], );
        case "gold":
            return manageProspecting(client, con, player, message, "gold", args[1], );
        case "malachite":
            return manageProspecting(client, con, player, message, "malachite", args[1], );
        default:
            return message.channel.send(prospectEmbed);
    }
};

exports.help = {
    name: "prospect",
    description_fr: "Cherche des gemmes précieuses dans 5 minerais d'un métal de faible valeur. Cela détruira le minerai.",
    description_en: "Look for precious gems in 5 ores of a low value metal. This will destroy the ore.",
    usage_fr: "<minerai> <quantité>",
    usage_en: "<ore> <quantity>",
    category: "RPG",
    aliases: ["pros", "prospection"]
};
