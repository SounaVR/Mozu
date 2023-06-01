module.exports = class Dungeon {
    constructor(collector, creature, player) {
        this.collector = collector;
        this.creature = creature;
        this.player = player;
    }

    playerTurn(interaction, ATKbutton, DEFbutton, buttonRow, action) {
        ATKbutton.setDisabled(true);
        DEFbutton.setDisabled(true);

        if (action === "atk") {
            this.player.attack(this.creature);
            if (this.creature.isDead()) {
                interaction.editReply({ content: `**${this.creature.name}** a été battu par : **${interaction.user.username}** !`, components: [] });
                return this.collector.stop();
            } else {
                interaction.editReply({ content: `❤(${this.player.displayHP()})${interaction.user.username} a infligé ${this.player.ATK} PV à ${this.creature.name} ❤(${this.creature.displayHP()})\nC'est au tour de la créature d'attaquer !`, components: [buttonRow] });
            }
        } else if (action === "def") {
            interaction.editReply({ content: `❤(${this.player.displayHP()})${interaction.user.username} a décidé de se défendre contre ${this.creature.name} ❤(${this.creature.displayHP()})\nC'est au tour de la créature d'attaquer !`, components: [buttonRow] });
        }

    }

    NPCturn(con, interaction, ATKbutton, DEFbutton, buttonRow, action) {
        ATKbutton.setDisabled(false);
        DEFbutton.setDisabled(false);

        if (action === "def") {
            this.creature.defend(this.player, this.player.DEF);
            if (this.player.isDead()) {
                this.player.die(con, interaction, this.collector, this.creature.name);
            } else {
                interaction.editReply({ content: `❤(${this.player.displayHP()})${interaction.user.username} a perdu ${this.creature.ATK} (-${this.player.DEF} 🛡️) PV à cause de ${this.creature.name} ❤(${this.creature.displayHP()})\nC'est à votre tour d'attaquer !`, components: [buttonRow] });
                con.query(`UPDATE data SET HP = ${this.player.defend(this.creature.ATK)} WHERE userid = ${interaction.user.id}`);
            }
        } else if (action === "atk") {
            this.creature.attack(this.player);
            if (this.player.isDead()) {
                this.player.die(con, interaction, this.collector, this.creature.name);
            } else {
                interaction.editReply({ content: `❤(${this.player.displayHP()})${interaction.user.username} a perdu ${this.creature.ATK} PV à cause de ${this.creature.name} ❤(${this.creature.displayHP()})\nC'est à votre tour d'attaquer !`, components: [buttonRow] });
                con.query(`UPDATE data SET HP = ${this.player.HP} WHERE userid = ${interaction.user.id}`);
            }
        }
    }
}