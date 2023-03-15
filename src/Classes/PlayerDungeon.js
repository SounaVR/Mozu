module.exports = class PlayerDungeon {
    constructor(HP, ATK, DEF) {
        this.HP = HP;
        this.maxHP = HP;
        this.ATK = ATK;
        this.DEF = DEF;
    }

    damage(damage) {
        this.HP -= damage;
    }
    
    attack(target) {
        target.damage(this.ATK);
    }

    defend(damage) {
        return damage - this.DEF;
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

    die(con, interaction, collector, creatureName) {
        interaction.editReply({ content: `**${interaction.user.username}** a été anéanti par : **${creatureName}** !`, components: [] });
        con.query(`UPDATE data SET HP = 0 WHERE userid = ${interaction.user.id}`);
        return collector.stop();
    }
}