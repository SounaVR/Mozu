const Enemy = require('./Enemy.js');
module.exports = class Zombie extends Enemy {
    constructor() {
        super({
            name: 'Zombie',
            HP: 15,
            ATK: 10,
            DEF: 1,
        })
    }
}