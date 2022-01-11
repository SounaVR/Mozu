const { Formatters } = require('discord.js')

exports.run = async (client, message, args, getPlayer, getUser) => {
    const clean = text => {
        if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
        return text;
    }
    if (!client.config.owners.includes(message.author.id)) return message.react("❌");
    try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
        
        message.channel.send(Formatters.codeBlock('xl', clean(evaled)))
    } catch (err) {
        message.channel.send({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\`` });
    }
};

exports.help = {
    name: "eval",
    description_fr: "Commande Admin",
    description_en: "Admin Command",
    category: "Staff"
};
