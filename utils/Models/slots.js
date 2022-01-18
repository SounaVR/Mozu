const { Schema, model } = require('mongoose');

module.exports = model("Slots", new Schema({
    GuildID: Number,
    uuid: Number,
    UserID: Number,
    UserTag: String,
    slot_a: Array,
    slot_b: Array,
    slot_c: Array
}))