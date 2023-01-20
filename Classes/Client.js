const { Client, Collection } = require("discord.js");
const { getPlayer } = require("../utils/u");

module.exports = class Mozu extends Client {
    constructor() {
        super({
            intents: 1799,
            allowedMentions: { parse: ["users", "roles"], repliedUser: true },
            restTimeOffset: 250
        });
        
        this.commands = new Collection();
        require("../Handlers/Events")(this);
        require("../Handlers/Commands")(this);

        this.getPlayer = getPlayer;
    }
}