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
        const damage = Math.floor(Math.random() * this.ATK) + 1;
        target.damage(damage);
        return damage;
    }

    defend(target, DEF) {
        const DEFamount = Math.floor(Math.random() * (this.ATK - DEF)) + 1;
        target.damage(DEFamount);
        return DEFamount;
    }

    getStatus() {
        return `__${this.name}__\nHP: ${this.HP}\nATK: ${this.ATK}\nDEF: ${this.DEF}`;
    }

    displayHP() {
        return `${this.HP}/${this.maxHP}`;
    }

    isDead() {
        return this.HP <= 0;
    }
}