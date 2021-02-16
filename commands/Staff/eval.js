exports.run = async (client, message, args, getPlayer, getUser) => {
  const clean = text => {
    if (typeof (text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
  }

  if (message.content.startsWith(client.config.prefix + "eval")) {
    if (!client.config.owners.includes(message.author.id)) return message.react("❌");
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};

exports.help = {
  name: "eval",
  description_fr: "Commande Admin",
  description_en: "Admin Command",
  category: "Staff"
};
