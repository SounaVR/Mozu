const { Schema, model } = require('mongoose');

module.exports = model("Prospect", new Schema({
    GuildID: Number,
    uuid: Number,
    UserID: Number,
    UserTag: String,
    sapphire: Number,
    amber: Number,
    citrine: Number,
    ruby: Number,
    jade: Number,
    amethyst: Number
}))