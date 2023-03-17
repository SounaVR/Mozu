const { Client, Collection } = require("discord.js");

const Default = require("../utils/default.json");
const Emotes = require("../utils/emotes.json");
const Connection = require('./Database')

module.exports = class Mozu extends Client {
    constructor() {
        super({
            intents: 1799,
            allowedMentions: { parse: ["users", "roles", "everyone"], everyone: false },
            restTimeOffset: 250
        });

        this.connection = new Connection();
        
        this.commands = new Collection();
        require("../Handlers/Events")(this);
        require("../Handlers/Commands")(this);
        const utils = require("../utils/u")(this);
        for (let i in utils) {
            this[i] = utils[i];
        }

        this.Default = Default;
        this.Emotes = Emotes;
    }
}