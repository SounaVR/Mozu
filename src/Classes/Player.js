module.exports = class Player {
    static getGems(gems) {
        return [Math.floor(gems % Math.pow(7, 1) / Math.pow(7, 0)), Math.floor(gems % Math.pow(7, 2) / Math.pow(7, 1)), Math.floor(gems / Math.pow(7, 2))];
    }

    static getGemNumber(gems) {
        return gems[0]+7*(gems[1]+7*gems[2])
    }
}