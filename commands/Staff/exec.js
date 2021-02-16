const Discord = require('discord.js');

exports.run = async (client, message, args, getPlayer, getUser) => {
    if (message.author.id !== "436310611748454401") return message.react("❌");

    const { exec } = require("child_process");

    exec(`${args.join(" ")}`, (error, stdout, stderr) => {
        if (error) {
            message.channel.send(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            message.channel.send(`stderr: ${stderr}`);
            return;
        }
        message.channel.send(`\`\`\`\n${stdout}\n\`\`\``);
    });
};

exports.help = {
    name: "exec",
    category: "Staff"
};
