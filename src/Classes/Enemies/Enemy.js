module.exports = class Enemy {
    constructor({ name, HP, ATK, DEF }) {
        this.name = name;
        this.maxHP = HP;
        this.HP = HP;
        this.ATK = ATK;
        this.DEF = DEF;
    }

    damage(damage) {
        this.HP -= damage;
    }

    attack(target) {
        const damage = Math.floor(Math.random() * this.ATK);
        target.damage(damage);
    }

    defend(target, DEF) {
        target.damage(this.ATK - DEF)
    }

    getStatus() {
        return `${this.name} HP: ${this.HP} ATK: ${this.ATK} DEF: ${this.DEF}`;
    }

    displayHP() {
        return `${this.HP}/${this.maxHP}`;
    }

    isDead() {
        return this.HP <= 0;
    }
}