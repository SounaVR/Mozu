const { MessageButton } = require("discord-buttons");
const Discord = require("discord.js"),
floor1        = require('../utils/creatures/floor-1.json');

module.exports = async function(client, message, getPlayer) {
    const con = client.connection;
    const player = await getPlayer(con, message.author.id);
    const lang = require(`../utils/text/${player.data.lang}.json`);

    let ATKbutton = new MessageButton().setEmoji("771095091216515123").setStyle("red").setID("atk").setDisabled(false);

    var hp = floor1.Wolf.HP;

    const combat = await message.reply(`Vous engagez le combat contre :\n__${floor1.Wolf.name}__\nHP : ${floor1.Wolf.HP}\nATK : ${floor1.Wolf.ATK}\nDEF : ${floor1.Wolf.DEF}`, ATKbutton).then(async (combat) => {
        const buttonFilter = (button) => button.clicker.user.id === message.author.id;
        const buttonCollector = combat.createButtonCollector(buttonFilter, { time: 60000 })

        buttonCollector.on('collect', async button => {
            switch (button.id) {
                case "atk":
                    buttonCollector.resetTimer({ time: 60000 });
                    hp = hp - player.data.ATK;
                    playerTurn(hp, combat);

                    setTimeout(async () => {
                        HPhandler(buttonCollector, hp, combat);
                        var updateHP = await getPlayer(con, message.author.id);
                        if (updateHP.data.HP !== "0") NPCturn(combat, hp);
                    }, 2000);
            } //end switch button.id
        }); //end collected.on

        buttonCollector.on('end', () => {
            
        });
    }); //end async edit

    async function playerTurn(hp, combat) {
        ATKbutton.setDisabled(true);
        var updateHP = await getPlayer(con, message.author.id);
        combat.edit(`❤(${updateHP.data.HP}/50)${message.author.username} a infligé ${player.data.ATK} PV à ${floor1.Wolf.name} ❤(${hp}/${floor1.Wolf.HP})\nC'est au tour de la créature d'attaquer !`, ATKbutton);
        con.query(`UPDATE data SET HP = ${updateHP.data.HP - floor1.Wolf.ATK} WHERE userid = ${message.author.id}`);
    }
    
    async function NPCturn(combat, hp) {
        var updateHP = await getPlayer(con, message.author.id);
        ATKbutton.setDisabled(false);
        combat.edit(`❤(${updateHP.data.HP}/50)${message.author.username} a perdu ${floor1.Wolf.ATK} PV à cause de ${floor1.Wolf.name} ❤(${hp}/${floor1.Wolf.HP})\nC'est à votre tour d'attaquer !`, ATKbutton)              
    }
    
    async function HPhandler(buttonCollector, hp, combat) {
        var updateHP = await getPlayer(con, message.author.id);
        try {
            if (hp === 0) {
                setTimeout(() => { combat.delete() }, 1000);
                message.channel.send(`${floor1.Wolf.name} a été battu par ${message.author.username} !`);
                return buttonCollector.stop();
            }
            if (hp !== 0 && (updateHP.data.HP < 0 || updateHP.data.HP === 0)) {
                con.query(`UPDATE data SET HP = 0 WHERE userid = ${message.author.id}`);
                setTimeout(() => { combat.delete() }, 1000);
                message.channel.send(`${message.author.username} a été anéanti par : ${floor1.Wolf.name}`);
                return buttonCollector.stop();
            }
        } catch (error) {
            return message.channel.send(error)
        }
    }
}