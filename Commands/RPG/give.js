const manageGive  = require('../../functions/manageGive'),
    Default       = require('../../utils/default.json');
    
module.exports.run = async (client, message, args, getPlayer, getUser) => {
    var con = client.connection
    var player = await getPlayer(con, message.author.id);
    if (!player) return message.channel.send(Default.notRegistered);
    const lang = require(`../../utils/text/${player.data.lang}.json`);
    const user = message.mentions.users.first() || message.author;
    const userid = message.author.id;
    var userDB = await getUser(con, user.id);

    if (!user || !userDB) return message.reply(lang.give.specifyUser);
    if (user.id === userid) return message.reply(`${lang.give.giveToSelf}`)
    if (user.bot) return message.reply(`${lang.give.giveToOtherBots}`)
    if (!args[0]) return message.reply(`${lang.give.correctUsage.replace("%s", client.config.prefix)}`)
    if (!args[1]) return message.reply(`${lang.give.correctUsage.replace("%s", client.config.prefix)}`)
    if (!args[2]) return message.reply(`${lang.give.specifyAmount}`)
    
    var member = await getUser(con, user.id);

    manageGive(client, con, args, player, member, message, 'stone', ['caillou', 'cailloux', 'stones']);
    manageGive(client, con, args, player, member, message, 'coal', ['charbon']);
    manageGive(client, con, args, player, member, message, 'copper', ['cuivre', 'cuivres', 'coppers']);
    manageGive(client, con, args, player, member, message, 'iron', ['fer', 'fers', 'irons']);
    manageGive(client, con, args, player, member, message, 'gold', ['or', 'ors', 'golds']);
    manageGive(client, con, args, player, member, message, 'malachite', ['malachites']);
};

module.exports.help = {
    name: "give",
    description_fr: "Pour donner des objets",
    description_en: "To give items",
    usage_fr: "<@quelqu'un> <objet> <quantité>",
    usage_en: "<@someone> <item> <quantity>",
    category: "RPG",
    aliases: ["g", "gi"]
};
