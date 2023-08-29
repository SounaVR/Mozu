module.exports = class PlayerDungeon {
    constructor(HP, maxHP, ATK, DEF) {
        this.maxHP = maxHP;
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

    displayHP() {
        return `${this.HP}/${this.maxHP}`;
    }

    isDead() {
        return this.HP <= 0;
    }

    die(con, interaction, collector, creatureName) {
        interaction.editReply({ content: `**${interaction.user.username}** a été anéanti par : **${creatureName}** !`, components: [] });
        con.query(`UPDATE data SET HP = 0 WHERE userid = ${interaction.user.id}`);
        return collector.stop();
    }
}