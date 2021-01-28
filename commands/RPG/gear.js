const Discord = require('discord.js'),
Default       = require('../../utils/default.json'),
Emotes        = require('../../utils/emotes.json');

exports.run = async (client, message, args, getPlayer, getUser, getUserFromMention) => {
    return message.channel.send("Commande en maintenance");
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);

    const firstEmbed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor)
    .setTitle("Gear tab")
    .setDescription("What you want to do ?")
    .addField(`${Emotes.rune}`, "Enchant")
    .addField(`${Emotes.armors}`, "Craft")
    .addField(`${Emotes.idk}`, "Sertissage")
    .setTimestamp()
    .setFooter(`${client.user.username}`, client.user.avatarURL());

    const enchantEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("ENCHANT")
        .setThumbnail("https://media.discordapp.net/attachments/691992473999769623/796006868212383755/EnchantedDiamondSwordNew.gif")
        .addField("Description", `${lang.enchant.description}`)
        .addField("Documentation", `${lang.enchant.doc} :\n\n- [ ${Emotes.chests.Tools.rune_pickaxe} = ${lang.inventory.pickaxe} ]\n\n- [ ${playerClasse}\n\n${txt.join("\n")}`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

    const firstMessage = await message.channel.send(firstEmbed)

    let reactFirstEmbed = ['748972784410951721', '756140390796492903', '691648979641040907'];

    await firstMessage.react(reactFirstEmbed[0]);
    await firstMessage.react(reactFirstEmbed[1]);
    await firstMessage.react(reactFirstEmbed[2]);

    const filterFirstEmbed = (reaction, user) => reactFirstEmbed.includes(reaction.emoji.id) && user.id === message.author.id;

    const collectorFirstEmbed = firstMessage.createReactionCollector(filterFirstEmbed, { time: 60000 });

    collectorFirstEmbed.on('collect', async reaction => {
        firstMessage.delete();
        switch(reaction.emoji.id) {
            case reactFirstEmbed[0]:
                const enchantMessage = await message.channel.send(enchantEmbed);

                let reactEnchantEmbed = [
                    "748973331642056764", //pickaxe
                    "771095091216515123", //sword
                    "771113421202391051", //shield
                    "748960787946537030", //wand
                    "771331757399212053", //bow
                    "748959964663382106", //tete
                    "748959724170379324", //epaule
                    "748960199389479053", //torse
                    "748960470479798324", //poignets
                    "748960653930135613", //mains
                    "748961288960606300", //taille
                    "748961288968994888", //jambes
                    "748961289145155684"  //pieds
                ];

                await enchantMessage.react(reactEnchantEmbed[0]);
                await enchantMessage.react(reactEnchantEmbed[1]);
                await enchantMessage.react(reactEnchantEmbed[2]);
                await enchantMessage.react(reactEnchantEmbed[3]);
                await enchantMessage.react(reactEnchantEmbed[4]);
                await enchantMessage.react(reactEnchantEmbed[5]);
                await enchantMessage.react(reactEnchantEmbed[6]);
                await enchantMessage.react(reactEnchantEmbed[7]);
                await enchantMessage.react(reactEnchantEmbed[8]);
                await enchantMessage.react(reactEnchantEmbed[9]);
                await enchantMessage.react(reactEnchantEmbed[10]);
                await enchantMessage.react(reactEnchantEmbed[11]);
                await enchantMessage.react(reactEnchantEmbed[12]);

                const filterEnchantEmbed = (reaction, user) => reactEnchantEmbed.includes(reaction.emoji.id) && user.id === message.author.id;

                const collectorEnchantEmbed = enchantMessage.createReactionCollector(filterEnchantEmbed, { time: 60000 });

                collectorEnchantEmbed.on('collect', reaction => {
                    enchantMessage.delete();
                    switch(reaction.emoji.id) {
                        
                    }
                })
        }
    })
};

exports.help = {
    name: "gear",
    description_fr: "Panel de gestion de votre équipement",
    description_en: "Management panel for your equipment",
    usage_fr: "",
    usage_en: "",
    category: "RPG",
    aliases: ["stuff"]
};
