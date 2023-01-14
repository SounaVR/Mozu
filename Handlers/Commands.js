const { REST, Routes } = require('discord.js');
const fs = require('fs');

module.exports = async (client) => {
    let commandsArray = [];
    
    const load = (dir = "src/Commands/") => {
        fs.readdirSync(dir).forEach(dirs => {
            const commands = fs.readdirSync(`${dir}${dirs}`).filter(f => f.endsWith(".js"));

            commands.forEach(file => {
                let command = require(`../${dir}${dirs}/${file}`);
                if ("data" in command && "execute" in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
                }

                commandsArray.push(command.data.toJSON());
            });
        });
    }
    load();

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    const data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commandsArray },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
}