const { Events } = require('../utils/EventNames');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

module.exports = async (client) => {
    const Table = new Ascii("Events Loaded");

    (await PG(`../Events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if (!Events.includes(event.name) || !event.name) {
            const L = file.split("/");
            Table.addRow(`${event.name || "MISSING"}`, `⛔ Event name is either invalid or missing: ${L[6] + `/` + L[7]}`);
            return;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        };

        Table.addRow(event.name, "✔ SUCCESSFUL");
    });

    console.log(Table.toString());
}