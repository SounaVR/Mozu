const Items = require('../utils/Items/en.json');

module.exports = class Player {
    static getMaxHP(player) {
        let baseHP = 50;
        let armorHP = 0;
        const gear = ["head", "shoulders", "chest", "wrists", "hands", "waist", "legs", "feet"];

        gear.forEach(element => {
            let HP = Items.armors[element][player.items[element]].HP;
            if (HP >= 0) armorHP += HP;
        });

        let maxHP = baseHP + armorHP;

        return maxHP;
    }

    static getGems(gems) {
        if (gems === -1) return [0, 0, 0];
        return [Math.floor(gems % Math.pow(7, 1) / Math.pow(7, 0)), Math.floor(gems % Math.pow(7, 2) / Math.pow(7, 1)), Math.floor(gems / Math.pow(7, 2))];
    }

    static getGemNumber(gems) {
        return gems[0] + 7 * (gems[1] + 7 * gems[2]);
    }
}