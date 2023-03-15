const Enemy = require('./Enemy.js');
module.exports = class Wolf extends Enemy {
    constructor() {
        super({
            name: 'Wolf',
            HP: 10,
            ATK: 5,
            DEF: 1,
        })
    }
}