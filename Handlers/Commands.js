const { Client, Permissions, Collection } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    const Table = new Ascii("Command Loaded");

    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name) return Table.addRow(file.split("/")[7], "🔴 FAILED", "Missing a name.");
        if (command.type !== "USER" && !command.description) return Table.addRow(command.name, "🔴 FAILED", "Missing a description.");

        if (command.permission) {
            if (Object.keys(Permissions.FLAGS).includes(command.permission))
            command.defaultPermission = false;
            else
            return Table.addRow(command.name, "🔴 FAILED", "Permission is invalid.");
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        Table.addRow(command.name, "✔ SUCCESSFUL");
    });

    console.log(Table.toString());

    // PERMISSIONS CHECK //
    client.on("ready", async() => {
        const MainGuild = client.guilds.cache.get("655340308896153601");

        MainGuild.commands.set(CommandsArray).then(async (command) => {
            const roles = (commandName) => {
                const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
                if (!cmdPerms) return new Collection();

                return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);
            }

            const perms = command.map((r) => roles(r.name).size === 0 ? false : { id: r.id, permissions: roles(r.name).map(({ id }) => ({ id: id, type: "ROLE", permission: true })) }).filter(e => Boolean(e));

            await MainGuild.commands.permissions.set({ fullPermissions: perms });
        });
    });
}