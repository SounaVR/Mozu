const { Schema, model } = require('mongoose');

module.exports = model("Items", new Schema({
    GuildID: Number,
    uuid: Number,
    UserID: Number,
    UserTag: String,
    ring: Number,
    dungeon_amulet: Number,
    pickaxxe: Number,
    sword: Number,
    shield: Number,
    head: Number,
    shoulders: Number,
    chest: Number,
    wrists: Number,
    hands: Number,
    waist: Number,
    legs: Number,
    feet: Number
}))