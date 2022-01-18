const { Schema, model } = require('mongoose');

module.exports = model("Data", new Schema({
    GuildID: Number,
    uuid: Number,
    UserID: Number,
    UserTag: String,
    lang: String,
    ban: Number,
    money: Number,
    manaCooldown: Number,
    hpCooldown: Number,
    energyCooldown: Number, 
    lastActivity: Number,
    HP: Number,
    MANA: Number,
    ATK: Number,
    DEF: Number,
    power: Number,
    HR: Number,
    lastHR: Number,
    daily: Number,
    lastDaily: Number,
    rep: Number,
    lastRep: Number
}))