/**
 * @author ReallySouna
 * @file craft.js
 * @licence MIT
 */

module.exports.run = async (bot, message, args) => {
    const sqlite = require('sqlite3').verbose()
    const Discord = require('discord.js')
    const Default = require('../../utils/default.json')
    const Text = require("../../utils/text/fr.json")

    const userid = message.author.id
    const uname = message.author.tag
    const db = new sqlite.Database('./data/db.db', sqlite.OPEN_READWRITE)
    const query = 'SELECT * FROM mine WHERE userid = ?'
    const queryD = 'SELECT * FROM data WHERE userid = ?'

    db.get(query, [userid], (err, row) => {
        if (err) return catchErr(err, message)

        db.get(queryD, [userid], (err, rowD) => {
            if (err) return catchErr(err, message)

            if (row === undefined || rowD === undefined) {
              const insertdata = db.prepare('INSERT INTO mine VALUES(?,?,?,?,?,?,?,?,?,?)');/*,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');*/
              insertdata.run(userid, uname, Default.mine.xp, Default.mine.level, Default.pioches.default, Default.mine.cailloux, Default.mine.cuivre, Default.mine.fer, Default.mine.gold, Default.mine.malachite);/*, Default.mine.orichalque, Default.mine.cobalt, Default.mine.argent, Default.mine.fer_nain, Default.mine.argent_lycanthrope, Default.mine.or_elfe, Default.mine.emeraude, Default.mine.saphir, Default.mine.rubis, Default.mine.diamant, Default.mine.joyau_pur, Default.mine.ebonite, Default.mine.ecaille_de_dragon_ancien, Default.mine.adamantium);*/
              insertdata.finalize()
              message.channel.send('Veuillez patienter... Génération de votre inventaire en cours.').then(e => {
                setInterval(() => {
                  e.edit('Génération terminée, vous pouvez refaire la commande.')
                }, 1500)
              })
              db.run(`UPDATE mine SET Pioche = ? WHERE userid = ?`, [Default.pioches.default, userid]);

              const insertdataD = db.prepare('INSERT INTO data VALUES(?,?,?,?,?,?,?,?,?)')
              insertdataD.run(userid, uname, Default.money, Default.LastDaily, Default.hr, Default.PV, Default.MANA, Default.LastActivity, Default.Energy)
              insertdataD.finalize()
              db.close()
            } else {
                if (message.content.toLowerCase() === "r!craft") {
                    const craftEmbed = new Discord.MessageEmbed()
                        .setColor(message.member.displayColor)
                        .setTitle("Bienvenue dans l'espace de créations d'objets !")
                        //.setDescription('Pour accéder à une catégorie, tapez `r!craft <mine>`')
                        .addField("Minage", "Permet la création de pioches.")
                        .addField("Autre", "Permet la création de rien.")
                        .setTimestamp()
                        .setFooter(`${bot.user.username}`, bot.user.avatarURL());
                        message.channel.send(craftEmbed);
                }

                if (message.content.toLowerCase() === "r!craft mine") {
                    const mineEmbed = new Discord.MessageEmbed()
                        .setColor(message.member.displayColor)
                        .setTitle("Bienvenue dans l'espace de créations de pioches !")
                        .setDescription('Pour faire une pioche :\ntapez `r!craft mine <stone/cuivre/fer/or/malachite>`')
                        .addField("Rudimentaire pioche en pierre", `1k ${Default.emotes.caillou} 10 ⚡`)
                        .addField("Pioche cuivrée", `1k ${Default.emotes.caillou} 800 ${Default.emotes.cuivre} 20 ⚡`)
                        .addField("Belle pioche de fer", `1k ${Default.emotes.caillou} 800 ${Default.emotes.cuivre} 600 ${Default.emotes.fer} 30 ⚡`)
                        .addField("Pioche ostentatoire", `1k ${Default.emotes.caillou} 800 ${Default.emotes.cuivre} 600 ${Default.emotes.fer} 400 ${Default.emotes.gold} 40 ⚡`)
                        .addField("Pioche en malachite de haute qualité", `1k ${Default.emotes.caillou} 800 ${Default.emotes.cuivre} 600 ${Default.emotes.fer} 400 ${Default.emotes.gold} 200 ${Default.emotes.malachite} 50 ⚡`)
                        .setTimestamp()
                        .setFooter(`${bot.user.username}`, bot.user.avatarURL());
                        message.channel.send(mineEmbed)
                }

                if (message.content.toLowerCase() === "r!craft mine stone") {
                    if (row.Pioche === Default.pioches.default) {
                        if (row.cailloux >= 1000 && rowD.Energy >= 10 && row.level >= 1) {
                            db.run(`UPDATE mine SET Pioche = ? WHERE userid = ?`, [Default.pioches.stone, userid]);
                            db.run(`UPDATE mine SET cailloux = ? WHERE userid = ?`, [row.cailloux - 30, userid]);
                            db.run('UPDATE data SET Energy = ? WHERE userid = ?', [rowD.Energy - 10, userid])
                            message.channel.send(Text.craft.success1 + "**" + Default.pioches.stone + "**" + Text.craft.success2);
                        } else if (row.cailloux < 1000) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (rowD.Energy < 10) {
                            message.channel.send(Text.craft.errorEnergy);
                        } else if (row.level < 1) {
                            message.channel.send("Vous devez être niveau 1 pour faire cette pioche.")
                        }
                    } else if (row.Pioche === Default.pioches.stone) {
                        message.channel.send(Text.craft.errorPick);
                    } else if (row.Pioche === Default.pioches.cuivre || Default.pioches.fer || Default.pioches.or || Default.pioches.malachite) {
                        message.channel.send(Text.craft.errorCraft);
                    }
                }
                if (message.content.toLowerCase() === "r!craft mine cuivre") {
                    if (row.Pioche === Default.pioches.stone) {
                        if (row.cailloux >= 1000 && row.cuivre >= 800 && rowD.Energy >= 20 && row.level >= 5) {
                            db.run(`UPDATE mine SET Pioche = ? WHERE userid = ?`, [Default.pioches.cuivre, userid]);
                            db.run(`UPDATE mine SET cuivre = ? WHERE userid = ?`, [row.cuivre - 25, userid]);
                            db.run('UPDATE data SET Energy = ? WHERE userid = ?', [rowD.Energy - 10, userid])
                            message.channel.send(Text.craft.success1 + "**" + Default.pioches.cuivre + "**" + Text.craft.success2);
                        } else if (row.cailloux < 1000 {
                          message.channel.send(Text.craft.errorRessources);
                        } else if (row.cuivre < 800) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (rowD.Energy < 20) {
                            message.channel.send(Text.craft.errorEnergy);
                        } else if (row.level < 5) {
                            message.channel.send("Vous devez être niveau 5 pour faire cette pioche.")
                        }
                    } else if (row.Pioche === Default.pioches.default) {
                        message.channel.send(`fait les pioches dans l'ordre et tg`)
                    } else if (row.Pioche === Default.pioches.cuivre) {
                        message.channel.send(Text.craft.errorPick);
                    } else if (row.Pioche === Default.pioches.fer || Default.pioches.or || Default.pioches.malachite) {
                        message.channel.send(Text.craft.errorCraft);
                    }
                }
                if (message.content.toLowerCase() === "r!craft mine fer") {
                    if (row.Pioche === Default.pioches.cuivre) {
                        if (row.cailloux >= 1000 && row.cuivre >= 800 && row.fer >= 600 && rowD.Energy >= 30 && row.level >= 10) {
                            db.run(`UPDATE mine SET Pioche = ? WHERE userid = ?`, [Default.pioches.fer, userid]);
                            db.run(`UPDATE mine SET fer = ? WHERE userid = ?`, [row.fer - 20, userid]);
                            db.run('UPDATE data SET Energy = ? WHERE userid = ?', [rowD.Energy - 10, userid])
                            message.channel.send(Text.craft.success1 + "**" + Default.pioches.fer + "**" + Text.craft.success2);
                        } else if (row.cailloux < 1000) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.cuivre < 800) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.fer < 600) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (rowD.Energy < 30) {
                            message.channel.send(Text.craft.errorEnergy);
                        } else if (row.level < 10) {
                            message.channel.send("Vous devez être niveau 10 pour faire cette pioche.")
                        }
                    } else if (row.Pioche === Default.pioches.fer) {
                        message.channel.send(Text.craft.errorPick);
                    } else if (row.Pioche === Default.pioches.or || Default.pioches.malachite) {
                        message.channel.send(Text.craft.errorCraft);
                    } else if (row.Pioche === Default.pioches.default || Default.pioches.cuivre || Default.pioches.stone) {
                        message.channel.send(`fait les pioches dans l'ordre et tg`)
                    }
                }
                if (message.content.toLowerCase() === "r!craft mine or") {
                    if (row.Pioche === Default.pioches.fer) {
                        if (row.cailloux >= 1000 && row.cuivre >= 800 && row.fer >= 600 && row.gold >= 400 && rowD.Energy >= 40 && row.level >= 15) {
                            db.run(`UPDATE mine SET Pioche = ? WHERE userid = ?`, [Default.pioches.or, userid]);
                            db.run(`UPDATE mine SET gold = ? WHERE userid = ?`, [row.gold - 20, userid]);
                            db.run('UPDATE data SET Energy = ? WHERE userid = ?', [rowD.Energy - 10, userid])
                            message.channel.send(Text.craft.success1 + "**" + Default.pioches.or + "**" + Text.craft.success2);
                        } else if (row.cailloux < 1000) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.cuivre < 800) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.fer < 600) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.gold < 400) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (rowD.Energy < 40) {
                            message.channel.send(Text.craft.errorEnergy);
                        } else if (row.level < 15) {
                            message.channel.send("Vous devez être niveau 15 pour faire cette pioche.")
                        }
                    } else if (row.Pioche === Default.pioches.or) {
                        message.channel.send(Text.craft.errorPick);
                    } else if (row.Pioche === Default.pioches.malachite) {
                        message.channel.send(Text.craft.errorCraft);
                    } else {
                        message.channel.send(`fait les pioches dans l'ordre et tg`)
                    }
                }
                if (message.content.toLowerCase() === "r!craft mine malachite") {
                    if (row.Pioche === Default.pioches.or) {
                        if (row.cailloux >= 1000 && row.cuivre >= 800 && row.fer >= 600 && row.gold >= 400 && row.malachite >= 200 && rowD.Energy >= 50 && row.level >= 20) {
                            db.run(`UPDATE mine SET Pioche = ? WHERE userid = ?`, [Default.pioches.malachite, userid]);
                            db.run(`UPDATE mine SET malachite = ? WHERE userid = ?`, [row.malachite - 20, userid]);
                            db.run('UPDATE data SET Energy = ? WHERE userid = ?', [rowD.Energy - 10, userid])
                            message.channel.send(Text.craft.success1 + "**" + Default.pioches.malachite + "**" + Text.craft.success2);
                        } else if (row.cailloux < 1000) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.cuivre < 800) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.fer < 600) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.gold < 400) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (row.malachite < 200) {
                            message.channel.send(Text.craft.errorRessources);
                        } else if (rowD.Energy < 50) {
                            message.channel.send(Text.craft.errorEnergy);
                        } else if (row.level < 20) {
                            message.channel.send("Vous devez être niveau 20 pour faire cette pioche.");
                        }
                    } else if (row.Pioche === Default.pioches.malachite) {
                        message.channel.send("Vous possédez déjà la pioche maximale.");
                    } else {
                        message.channel.send(`fait les pioches dans l'ordre et tg`)
                    }
                }
            }
        })
    })
};

// Help Object
module.exports.help = {
    name: "craft",
    description: "Pour fabriquer du stuff",
    usage: "<mine> <ressource>",
    category: "RPG",
    aliases: ["cra"]
};
