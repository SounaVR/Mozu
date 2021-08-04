
const Default = require('../../utils/default.json'),
manageDungeon = require('../../functions/manageDungeon.js');

exports.run = async (client, message, args, getPlayer, getUser) => {
    if (message.author.id !== client.config.owners[0]) return message.channel.send("Commande en maintenance.");
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(`${Default.notRegistered}`);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const react = ["780222056007991347", "780222833808506920"];

    if (player.data.HP == 0) return message.reply("vous n'avez pas assez de points de vie pour lancer un donjon.");

    const msg = await message.reply("désirez-vous entrer dans le donjon ?");

    await msg.react(react[0]);
    await msg.react(react[1]);

    const reactionFilter = (reaction, user) => react.includes(reaction.emoji.id) && user.id === message.author.id;
    msg.awaitReactions(reactionFilter, { max: 1, time: 45000, errors: ['time'] })
    .then(async collected => {
        const reaction = collected.first()

        switch (reaction.emoji.id) {
            case react[0]:
                await msg.delete();
                manageDungeon(client, message, getPlayer);
                break;
        
            case react[1]:
                msg.reactions.removeAll()
                return msg.edit("Vous n'êtes finalement pas entré dans le donjon.")
        } //end switch reaction.emoji.id
    }).catch(err => {
        console.error(err);
    });
};

exports.help = {
    name: "dungeon",
    description_fr: "c'est les donjons coucou",
    description_en: "it's the dungeons hello",
    category: "RPG",
    aliases: ["dj"]
};

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