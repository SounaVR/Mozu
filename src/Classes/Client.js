const { Client, Collection } = require("discord.js");
const { getPlayer, nFormatter, translate } = require("../utils/u");
const Default = require("../utils/default.json");
const Emotes = require("../utils/emotes.json");

module.exports = class Mozu extends Client {
    constructor() {
        super({
            intents: 1799,
            allowedMentions: { parse: ["users", "roles", "everyone"], everyone: false },
            restTimeOffset: 250
        });
        
        this.commands = new Collection();
        require("../Handlers/Events")(this);
        require("../Handlers/Commands")(this);

        this.getPlayer = getPlayer;
        this.nFormatter = nFormatter;
        this.translate = translate;
        this.Default = Default;
        this.Emotes = Emotes;
    }
}