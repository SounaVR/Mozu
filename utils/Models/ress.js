const { Schema, model } = require('mongoose');

module.exports = model("Ress", new Schema({
    GuildID: Number,
    uuid: Number,
    UserID: Number,
    UserTag: String,
    energy: Number,
    zone: Number,
    torch: Number,
    stone: Number,
    coal: Number,
    copper: Number,
    iron: Number,
    gold: Number,
    malachite: Number,
    chests: Array,
    runes : Array
}))