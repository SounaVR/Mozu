//load files and packages
const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const outils = require("../playerequipment/outils.json");
const picks = require("../itemdata/picks.json");
const users = require("../users.json");
const woodInv = require("../playerinventory/wood.json");
const mineInv = require("../playerinventory/ores.json");

module.exports.run = async (bot, message, args) => {

	//if (message.author.id !== '436310611748454401') return message.reply("en construction.");
  let item = picks[args[0]];
  //define users
	let users = JSON.parse(fs.readFileSync("users.json", "utf8"));
  //emojis
	  const woodmoji = bot.emojis.find(emoji => emoji.name === "RPGwood");
	  const fer = bot.emojis.find(emoji => emoji.name === "RPGmine_fer");
	  const or = bot.emojis.find(emoji => emoji.name === "RPGmine_or");
	  const malachite = bot.emojis.find(emoji => emoji.name === "RPGmine_malachite");
    const orichalque = bot.emojis.find(emoji => emoji.name === "RPGmine_orichalque");
    const cobalt = bot.emojis.find(emoji => emoji.name === "RPGmine_cobalt");
    const emeraude = bot.emojis.find(emoji => emoji.name === "RPGmine_emeraude");
    const saphir = bot.emojis.find(emoji => emoji.name === "RPGmine_saphir");
    const rubis = bot.emojis.find(emoji => emoji.name === "RPGmine_rubis");
    const diamant = bot.emojis.find(emoji => emoji.name === "RPGmine_diamant");
    const joyau_pur = bot.emojis.find(emoji => emoji.name === "RPGmine_joyau_pur");
    const ebonite = bot.emojis.find(emoji => emoji.name === "RPGmine_ebonite");
    const ecaille_de_dragon_ancien = bot.emojis.find(emoji => emoji.name === "RPGmine_ecaille_de_dragon_ancien");
    const adamantium = bot.emojis.find(emoji => emoji.name === "RPGmine_adamantium");
    const rien = bot.emojis.find(emoji => emoji.name === "RPGmine_caillou");
    const cut = bot.emojis.find(emoji => emoji.name === "RPGwoodcutting"); 

  if (!users[message.author.id]) {
    users[message.author.id] = {
      valid: 0
    };
  }

  //define valid
  let curvalid = users[message.author.id].valid;
  //check if user has been register
  if (curvalid === 0) {
    return message.reply("désolé, tu ne sembles pas être enregistré, pour ci-faire, vous devez faire la commande `r!register`.");
  } else if (curvalid === 1) {

    if (!outils[message.author.id]) {
    outils[message.author.id] = {
      outils: "mains nues"
    };
  }
  if (!mineInv[message.author.id]) {
      mineInv[message.author.id] = {
          cailloux: 0,
          fer: 0,
          argent: 0,
          or: 0,
          fer_nain: 0,
          argent_lycanthrope: 0,
          or_elfe: 0,
          malachite: 0,
          orichalque: 0,
          cobalt: 0,
          emeraude: 0,
          saphir: 0,
          rubis: 0,
          diamant: 0,
          joyau_pur: 0,
          ebonite: 0,
          ecaille_de_dragon_ancien: 0,
          adamantium: 0
        };
    }
    if (!woodInv[message.author.id]) {
    woodInv[message.author.id] = {
      wood: 0
    };
  }

    let curwood = woodInv[message.author.id].wood;
    let curfer = mineInv[message.author.id].fer;
    let curargent = mineInv[message.author.id].argent;
    let curor = mineInv[message.author.id].or;
    let curferN = mineInv[message.author.id].fer_nain;
    let curargentL = mineInv[message.author.id].argent_lycanthrope;
    let curorE = mineInv[message.author.id].or_elfe;
    let curmala = mineInv[message.author.id].malachite;
    let curori = mineInv[message.author.id].orichalque;
    let curcobalt = mineInv[message.author.id].cobalt;
    let cureme = mineInv[message.author.id].emeraude;
    let cursaph = mineInv[message.author.id].saphir;
    let currubis = mineInv[message.author.id].rubis;
    let curdiam = mineInv[message.author.id].diamant;
    let curjoy = mineInv[message.author.id].joyau_pur;
    let curebo = mineInv[message.author.id].ebonite;
    let cureca = mineInv[message.author.id].ecaille_de_dragon_ancien;
    let curada = mineInv[message.author.id].adamantium;
    let curcailloux = mineInv[message.author.id].cailloux;

    let curActual = outils[message.author.id].outils;

  	if (message.content.toLowerCase() === "r!craft") {
    message.delete();
    let craftEmbed = new Discord.RichEmbed()
    .setColor("#FFFFFF")
    .setTitle("Bienvenue dans l'espace de créations d'objets !")
    .setDescription('Pour accéder à une catégorie, tapez "r!craft <mine/fish/hunt/wood"')
    .addField("Minage", "Permet la création de pioches.")
    .addField("Pêche", "Permet la création de cânnes à pêche.")
    .addField("Chasse", "Permet la création d'arcs 🤔 (Bientôt)")
    .addField("Bûcheron", "Permet la création d'haches supérieures. (Bientôt)")
    .setFooter(`${bot.user.username}`, bot.user.avatarURL);
    message.channel.send(craftEmbed)
    .then(msg => {
    msg.delete(30000)
  })
  }
    //pioches
    if (message.content.toLowerCase() === "r!craft mine") {
    message.delete();
    let mEmbed = new Discord.RichEmbed()
    .setColor("#FFFFFF")
    .setTitle("⚠ Les ressources requises ne sont pas définitives ⚠")
    .setDescription("Les pioches sont présentées comme ceci :\nNom de la pioche\nObjets requis")
    .addField("Pioche en bois", `30 ${woodmoji}, 30 ${rien}`)
    .addField("Pioche en fer", `50 ${woodmoji}, 30 ${fer}`)
    .addField("Pioche en or", `80 ${woodmoji}, 50 ${fer}, 30 ${or}`)
    .addField("Pioche en malachite", `110 ${woodmoji}, 80 ${fer}, 50 ${or}, 30 ${malachite}`)
    .addField("Pioche en orichalque", `140 ${woodmoji}, 110 ${fer}, 80 ${or}, 50 ${malachite}, 30 ${orichalque}`)
    .addField("Pioche en cobalt", `170 ${woodmoji}, 140 ${fer}, 110 ${or}, 80 ${malachite}, 50 ${orichalque}, 30 ${cobalt}`)
    .addField("Pioche en émeraude et autres", "Bientôt...")
    .setFooter('Pour créer une pioche : r!craft mine <bois/fer/or/etc...');
    message.channel.send(mEmbed)
    .then(msg => {
    msg.delete(30000)
  })
  }

    if(message.content.includes("mine bois")) {
          message.delete();
          if (curwood > 30) {
              message.reply("vous avez créé la pioche en bois avec succès, bon minage !")
              .then(msg => {
              msg.delete(30000)
              })
              woodInv[message.author.id] = {
                wood: curwood - 30
              };
              fs.writeFile("./playerinventory/wood.json", JSON.stringify(woodInv), (err) => {
                if (err) console.log(err)
              });
              outils[message.author.id] = {
              outils: "pioche en bois"
              };
              fs.writeFile("./playerequipment/outils.json", JSON.stringify(outils), (err) => {
              if (err) console.log(err)
              }); 
          } else if (curwood < 30) {
            message.reply("vous avez pas assez de bois pour fabriquer ceci.")
            .then(msg => {
            msg.delete(30000)
            })
          }
        } else if (message.content.includes("mine fer")) {           
          message.delete();
          if (curwood > 50) {
            if (curfer > 30) {
              message.reply("vous avez créé la pioche en fer avec succès, bon minage !")
              .then(msg => {
              msg.delete(30000)
              })
              woodInv[message.author.id] = {
                wood: curwood - 50
              };
              fs.writeFile("./playerinventory/wood.json", JSON.stringify(woodInv), (err) => {
                if (err) console.log(err)
              });
                    mineInv[message.author.id] = {
                    fer: curfer - 30,
                    argent: curargent,
                    or: curor,
                    fer_nain: curferN,
                    argent_lycanthrope: curargentL,
                    or_elfe: curorE,
                    malachite: curmala,
                    orichalque: curori,
                    cobalt: curcobalt,
                    emeraude: cureme,
                    saphir: cursaph,
                    rubis: currubis,
                    diamant: curdiam,
                    joyau_pur: curjoy,
                    ebonite: curebo,
                    ecaille_de_dragon_ancien: cureca,
                    adamantium: curada
                  };
              fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
                if (err) console.log(err)
              });
              outils[message.author.id] = {
              outils: "pioche en fer"
              };
              fs.writeFile("./playerequipment/outils.json", JSON.stringify(outils), (err) => {
              if (err) console.log(err)
              });
            } else if (curfer < 30) {
              message.reply("vous avez pas assez de fer pour fabriquer ceci.")
              .then(msg => {
              msg.delete(30000)
              })
            }
          } else if (curwood < 50) {
            message.reply("vous avez pas assez de bois pour fabriquer ceci.")
            .then(msg => {
              msg.delete(30000)
              })
          }
        } else if (message.content === "r!craft mine or") {            
          message.delete();
          if (curwood > 80) {
            if (curfer > 50) {
              if (curor > 30) {
                message.reply("vous avez créé la pioche en or avec succès, bon minage !")
                .then(msg => {
              msg.delete(30000)
              })
                woodInv[message.author.id] = {
                  wood: curwood - 80
                };
                fs.writeFile("./playerinventory/wood.json", JSON.stringify(woodInv), (err) => {
                if (err) console.log(err)
              });
                mineInv[message.author.id] = {
                  fer: curfer - 50,
                  argent: curargent,
                  or: curor - 30,
                  fer_nain: curferN,
                  argent_lycanthrope: curargentL,
                  or_elfe: curorE,
                  malachite: curmala,
                  orichalque: curori,
                  cobalt: curcobalt,
                  emeraude: cureme,
                  saphir: cursaph,
                  rubis: currubis,
                  diamant: curdiam,
                  joyau_pur: curjoy,
                  ebonite: curebo,
                  ecaille_de_dragon_ancien: cureca,
                  adamantium: curada
                  };
                  fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
                  if (err) console.log(err)
                  });
                  outils[message.author.id] = {
                  outils: "pioche en or"
                  };
                  fs.writeFile("./playerequipment/outils.json", JSON.stringify(outils), (err) => {
                  if (err) console.log(err)
                  }); 
              } else if (curor < 30) {
                message.reply("vous avez pas assez d'or pour fabriquer ceci.")
                .then(msg => {
              msg.delete(30000)
              })
              }
            } else if (curfer < 50) {
              message.reply("vous avez pas assez de fer pour fabriquer ceci.")
              .then(msg => {
              msg.delete(30000)
              })
            }
          } else if (curwood < 80) {
            message.reply("vous avez pas assez de bois pour fabriquer ceci.")
            .then(msg => {
              msg.delete(30000)
              })
          }
      } else if (message.content.includes("mine malachite")) {            
        message.delete();
          if (curwood > 110) {
            if (curfer > 80) {
              if (curor > 50) {
                if (curmala > 30) {
                  message.reply("vous avez créé la pioche en malachite avec succès, bon minage !")
                  .then(msg => {
              msg.delete(30000)
              })
                  woodInv[message.author.id] = {
                    wood: curwood - 110
                    };
                    fs.writeFile("./playerinventory/wood.json", JSON.stringify(woodInv), (err) => {
                    if (err) console.log(err)
                    });
                  mineInv[message.author.id] = {
                    fer: curfer - 80,
                    or: curor - 50,
                    malachite: curmala - 30,
                    argent: curargent,
                    fer_nain: curferN,
                    argent_lycanthrope: curargentL,
                    or_elfe: curorE,
                    orichalque: curori,
                    cobalt: curcobalt,
                    emeraude: cureme,
                    saphir: cursaph,
                    rubis: currubis,
                    diamant: curdiam,
                    joyau_pur: curjoy,
                    ebonite: curebo,
                    ecaille_de_dragon_ancien: cureca,
                    adamantium: curada
                    };
                    fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
                    if (err) console.log(err)
                    });   
                    outils[message.author.id] = {
                    outils: "pioche en malachite"
                    };
                    fs.writeFile("./playerequipment/outils.json", JSON.stringify(outils), (err) => {
                    if (err) console.log(err)
                    });               
                } else if (curmala < 30) {
                  message.reply("vous avez pas assez de malachite pour fabriquer ceci.")
                  .then(msg => {
              msg.delete(30000)
              })
                }
              } else if (curor < 50) {
                messsage.reply("vous avez pas assez d'or pour fabriquer ceci.")
                .then(msg => {
              msg.delete(30000)
              })
              }
            } else if (curfer < 80) {
              message.reply("vous avez pas assez de fer pour fabriquer ceci.")
              .then(msg => {
              msg.delete(30000)
              })
            }
          } else if (curwood < 110) {
            message.reply("vous avez pas assez de bois pour fabriquer ceci.")
            .then(msg => {
              msg.delete(30000)
              })
          }
      } else if (message.content === "r!craft mine orichalque") {          
        message.delete();
          if (curwood > 140) {
            if (curfer > 110) {
              if (curor > 80) {
                if (curmala > 50) {
                  if (curori > 30) {
                  message.reply("vous avez créé la pioche en orichalque avec succès, bon minage !")
                  .then(msg => {
              msg.delete(30000)
              })
                  woodInv[message.author.id] = {
                    wood: curwood - 140
                    };
                    fs.writeFile("./playerinventory/wood.json", JSON.stringify(woodInv), (err) => {
                    if (err) console.log(err)
                    });
                  mineInv[message.author.id] = {
                    fer: curfer - 110,
                    or: curor - 80,
                    malachite: curmala - 50,
                    orichalque: curori - 30,
                    argent: curargent,
                    fer_nain: curferN,
                    argent_lycanthrope: curargentL,
                    or_elfe: curorE,
                    cobalt: curcobalt,
                    emeraude: cureme,
                    saphir: cursaph,
                    rubis: currubis,
                    diamant: curdiam,
                    joyau_pur: curjoy,
                    ebonite: curebo,
                    ecaille_de_dragon_ancien: cureca,
                    adamantium: curada
                    };
                    fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
                    if (err) console.log(err)
                    });
                    outils[message.author.id] = {
                    outils: "pioche en orichalque"
                    };
                    fs.writeFile("./playerequipment/outils.json", JSON.stringify(outils), (err) => {
                    if (err) console.log(err)
                    }); 
                  } else if (curori < 30) {
                    message.reply("vous avez pas assez d'orichalque pour fabriquer ceci.")
                    .then(msg => {
              msg.delete(30000)
              })
                  }
                } else if (curmala < 50) {
                  message.reply("vous avez pas assez de malachite pour fabriquer ceci.")
                  .then(msg => {
              msg.delete(30000)
              })
                }
              } else if (curor < 80) {
                messsage.reply("vous avez pas assez d'or pour fabriquer ceci.")
                .then(msg => {
              msg.delete(30000)
              })
              }
            } else if (curfer < 110) {
              message.reply("vous avez pas assez de fer pour fabriquer ceci.")
              .then(msg => {
              msg.delete(30000)
              })
            }
          } else if (curwood < 140) {
            message.reply("vous avez pas assez de bois pour fabriquer ceci.")
            .then(msg => {
              msg.delete(30000)
              })
          }
      } else if (message.content.includes("mine cobalt")) {           
        message.delete();
          if (curwood > 170) {
            if (curfer > 140) {
              if (curor > 110) {
                if (curmala > 80) {
                  if (curori > 50) {
                    if (curcobalt > 30) {
                      message.reply("vous avez créé la pioche en cobalt avec succès, bon minage !")
                      .then(msg => {
                      msg.delete(30000)
                      })
                      woodInv[message.author.id] = {
                        wood: curwood - 170
                      };
                      fs.writeFile("./playerinventory/wood.json", JSON.stringify(woodInv), (err) => {
                    if (err) console.log(err)
                    });
                      mineInv[message.author.id] = {
                        fer: curfer - 140,
                        or: curor - 110,
                        malachite: curmala - 80,
                        orichalque: curori - 50,
                        cobalt: curcobalt - 30,
                        argent: curargent,
                        fer_nain: curferN,
                        argent_lycanthrope: curargentL,
                        or_elfe: curorE,
                        orichalque: curori,
                        emeraude: cureme,
                        saphir: cursaph,
                        rubis: currubis,
                        diamant: curdiam,
                        joyau_pur: curjoy,
                        ebonite: curebo,
                        ecaille_de_dragon_ancien: cureca,
                        adamantium: curada
                        };
                        fs.writeFile("./playerinventory/ores.json", JSON.stringify(mineInv), (err) => {
                        if (err) console.log(err)
                      });           
                      outils[message.author.id] = {
                      outils: "pioche en cobalt"
                      };
                      fs.writeFile("./playerequipment/outils.json", JSON.stringify(outils), (err) => {
                      if (err) console.log(err)
                      });             
                    } else if (curcobalt < 30) {
                      message.reply("vous avez pas assez de cobalt pour fabriquer ceci.")
                      .then(msg => {
              msg.delete(30000)
              })
                    }
                  } else if (curori < 50) {
                    message.reply("vous avez pas assez d'orichalque pour fabriquer ceci.")
                    .then(msg => {
              msg.delete(30000)
              })
                  }
                } else if (curmala < 80) {
                  message.reply("vous avez pas assez de malachite pour fabriquer ceci.")
                  .then(msg => {
              msg.delete(30000)
              })
                }
              } else if (curor < 110) {
                messsage.reply("vous avez pas assez d'or pour fabriquer ceci.")
                .then(msg => {
              msg.delete(30000)
              })
              }
            } else if (curfer < 140) {
              message.reply("vous avez pas assez de fer pour fabriquer ceci.")
              .then(msg => {
              msg.delete(30000)
              })
            }
          } else if (curwood < 170) {
            message.reply("vous avez pas assez de bois pour fabriquer ceci.")
            .then(msg => {
              msg.delete(30000)
              })
          }
      }
    if (message.content === 'r!craft fish') {
      message.delete();
      // let fEmbed = new Discord.RichEmbed()
      // .setColor("#FFFFFF")
      // .setDescription("Les cânnes à pêche sont présentées comme ceci :\nNom de la cânne\nObjets requis")
      // .addField("Cânne en bois", `30 ${woodmoji}`)
      // .addField("Cânne en fer", `50 ${woodmoji}, 30 ${fer}`)
      // .addField("Cânne en or", `80 ${woodmoji}, 50 ${fer}, 30 ${or}`)
      // .addField("Cânne en malachite", `110 ${woodmoji}, 80 ${fer}, 50 ${or}, 30 ${malachite}`)
      // .addField("Cânne en orichalque", `140 ${woodmoji}, 110 ${fer}, 80 ${or}, 50 ${malachite}, 30 ${orichalque}`)
      // .addField("Cânne en cobalt", `170 ${woodmoji}, 140 ${fer}, 110 ${or}, 80 ${malachite}, 50 ${orichalque}, 30 ${cobalt}`)
      // .addField("Cânne en émeraude et autres", "Bientôt...")
      // .setFooter("Pour créer quelque chose : (soon...)");
      // message.channel.send(fEmbed)
      // .then(msg => {
      //         msg.delete(30000)
      //     })
      message.reply("en construction.")
      .then(msg => {
        msg.delete(30000)
      })
    } else if (message.content === 'r!craft hunt') {
      message.delete();
      message.reply("en construction.")
      .then(msg => {
              msg.delete(30000)
              })
    } else if (message.content === 'r!craft wood') {
      message.delete()
      message.reply("en construction.")
      .then(msg => {
              msg.delete(30000)
              })
    }

    //
  }
}

module.exports.help = {
  name: "craft",
    aliases: []
}