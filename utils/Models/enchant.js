const { Schema, model } = require('mongoose');

module.exports = model("Enchant", new Schema({
    GuildID: Number,
    uuid: Number,
    UserID: Number,
    UserTag: String,
    ench_pickaxe: Number,
    ench_sword: Number,
    ench_shield: Number,
	ench_head: Number,
    ench_shoulders: Number,
    ench_chest: Number,
    ench_wrists: Number,
	ench_hands: Number,
    ench_waist: Number,
    ench_legs: Number,
    ench_feet: Number
}))