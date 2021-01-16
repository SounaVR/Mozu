const Discord = require('discord.js')
const Default = require('../../utils/default.json')

function manageCraftTools(client, con, args, player, message, objectName) {
  var con = client.connection
  const Tools = require(`../../utils/items/tools/${player.data.lang}.json`);
  const lang = require(`../../utils/text/${player.data.lang}.json`)

  if (args) { // Regarde le premier argument pour savoir ce que le mec il veut faire comme action

  let level = Math.floor(player.data[objectName])+1 // Là ici que l'ont dit c quoi le lvl du gens

  if (!Tools[objectName][level]) return message.channel.send(`${lang.craft.maxLevel}.`) // la ici on dit si le mec il demande un niveau valide ou aps

  let currentObject = Tools[objectName][level]; // la ont défini la pioche correspondante au lvl demandé
  let txt = [`${lang.craft.toCraft1} [**${currentObject.name}**] ${lang.craft.level} ${level}, ${lang.craft.toCraft2} :`] // la on débute le message des ress qu'il faut
    for (const ressource in currentObject.ressource) {
      txt.push(`${Default.emotes[ressource]}${ressource}: ${currentObject.ressource[ressource]}`) // là pour chaques ress
    }

  message.channel.send(txt.join('\n')).then(async e => { // et la on envoie le message
    await e.react("✅");
    await e.react("❌");

    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    e.awaitReactions(filter, { max: 1 })
    .then(collected => {
      const reaction = collected.first();

    if (reaction.emoji.name === '✅') {
      let need = [`${lang.craft['error_' + objectName]}`]
      let resssql = []
      if (player.data.level < currentObject.level) {
        e.reactions.removeAll();
        return e.edit(`❌ ${lang.craft.errorLevel} ! (${Math.floor(player.data.level)}/${currentObject.level} ${Default.emotes.idk})`)
      }
      for (var ressource in currentObject.ressource) {
        if (player.data[ressource.toLowerCase()] < currentObject.ressource[ressource]) need.push(`${Default.emotes[ressource]} ${Math.floor(currentObject.ressource[ressource]-player.data[ressource.toLowerCase()])} ${lang.inventory[ressource]}`)
        resssql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`) // La on complète la requête sql pour les ress
      }

      e.reactions.removeAll();
      if (need.length > 1) return e.edit(need.join('\n')) // la ici on Regarde si il manque des ressource
      con.query(`UPDATE data SET ${resssql.join(',')}, ATK = ${player.data.ATK + Number(currentObject.ATK)}, DEF = ${player.data.DEF + Number(currentObject.DEF)}, ${objectName} = ${level} WHERE userid = ${message.author.id}`) // la on lui boufe les ress et on up la pioche

      e.edit(`${lang.craft.done} **${currentObject.name}** !`) // la on lui dit qu'il as eu une nouvelle pioche
      } else if (reaction.emoji.name === '❌') {
        e.edit(`${lang.craft.cancel}`);
      }
      e.reactions.removeAll();
      }) // end collected
    });
  }
}

function manageCraftArmor(client, con, args, player, message, objectName) {
  var con = client.connection
  const Armor = require(`../../utils/items/armor/${player.data.lang}.json`);
  const lang = require(`../../utils/text/${player.data.lang}.json`)

  let level = Math.floor(player.data[objectName])+1 // Là ici que l'ont dit c quoi le lvl du gens

  if (!Armor[player.data.classe][objectName][level]) return message.channel.send(`${lang.craft.maxLevel}.`) // la ici on dit si le mec il demande un niveau valide ou aps

  let currentObject = Armor[player.data.classe][objectName][level]; // la ont défini la pioche correspondante au lvl demandé
  let txt = [`${lang.craft.toCraft1} [**${currentObject.name}**] ${lang.craft.level} ${level}, ${lang.craft.toCraft2} :`] // la on débute le message des ress qu'il faut
  for (const ressource in currentObject.ressource) {
    txt.push(`${Default.emotes[ressource]}${ressource}: ${currentObject.ressource[ressource]}`) // là pour chaques ress
  }

  message.channel.send(txt.join('\n')).then(async e => { // et la on envoie le message
  await e.react("✅");
  await e.react("❌");

  const filter = (reaction, user) => {
    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
  };

  e.awaitReactions(filter, { max: 1 })
  .then(collected => {
    const reaction = collected.first();

  if (reaction.emoji.name === '✅') {
    if (player.data.level < currentObject.level) {
      e.reactions.removeAll();
      return e.edit(`❌ ${lang.craft.errorLevel} ! (${Math.floor(player.data.level)}/${currentObject.level} ${Default.emotes.idk})`)
    }
    let need = [`${lang.craft['error_' + objectName]}`] // La on set le message de base au cas ou il manque des ress
    let resssql = [] // La on défini un bout de la requête sql
    for (var ressource in currentObject.ressource) { // La on fait une boucle avec toutes les ressource
      if (player.data[ressource.toLowerCase()] < currentObject.ressource[ressource]) need.push(`${Default.emotes[ressource]} ${Math.floor(currentObject.ressource[ressource]-player.data[ressource.toLowerCase()])} ${lang.inventory[ressource]}`)
        // là on chab si le pelo as les ress qui faut
      resssql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource]}`) // La on complète la requête sql pour les ress
    }

    e.reactions.removeAll();
    if (need.length > 1) return e.edit(need.join('\n')) // la ici on Regarde si il manque des ressource
    con.query(`UPDATE data SET ${resssql.join(',')}, DEF = ${player.data.DEF + Number(currentObject.DEF)}, ${objectName} = ${level} WHERE userid = ${message.author.id}`) // la on lui boufe les ress et on up la pioche

    e.edit(`${lang.craft.done} **${currentObject.name}** !`) // la on lui dit qu'il as eu une nouvelle pioche
    } else if (reaction.emoji.name === '❌') {
      e.edit(`${lang.craft.cancel}`);
    }
    e.reactions.removeAll();
    }) // end collected
  });
}

async function manageCraftObjects(client, con, args, player, message, objectName) {
  var con = client.connection
  const Objects = require(`../../utils/items/tools/${player.data.lang}.json`);
  const lang = require(`../../utils/text/${player.data.lang}.json`)
  
  let level = 0; // Là ici que l'ont dit c quoi le lvl du gens

  var filter = m => m.author.id == message.author.id;
  message.channel.send(`${lang.craft.typingNumber}`)
  
  var collectedMessages = await message.channel.awaitMessages(filter, {time: 30000, max: 1, errors: ['time']});
  var response = collectedMessages.first().content;

  if (isNaN(response) || response == 0) {
    message.channel.send(`${lang.craft.validNumber}`)
  } else if (response > 0) {
  let currentObject = Objects[objectName][level];

  let txt = [`${lang.craft.toCraft1} [${response}x **${currentObject.name}**], ${lang.craft.toCraft2} :`] // la on débute le message des ress qu'il faut
  for (const ressource in currentObject.ressource) {
    txt.push(`${Default.emotes[ressource]}${ressource}: ${currentObject.ressource[ressource] * response}`) // là pour chaques ress
  }

  message.channel.send(txt.join('\n')).then(async e => { // et la on envoie le message
    await e.react("✅");
    await e.react("❌");

    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    e.awaitReactions(filter, { max: 1 })
    .then(collected => {
    const reaction = collected.first();

    if (reaction.emoji.name === '✅') {
    let need = [`${lang.craft['error_' + objectName]}`] // La on set le message de base au cas ou il manque des ress
    let resssql = [] // La on défini un bout de la requête sql
    for (var ressource in currentObject.ressource) { // La on fait une boucle avec toutes les ressource
      if (player.data[ressource.toLowerCase()] < (currentObject.ressource[ressource] * response)) need.push(`${Default.emotes[ressource]} ${Math.floor((currentObject.ressource[ressource] * response)-player.data[ressource.toLowerCase()])} ${lang.inventory[ressource]}`)
        // là on chab si le pelo as les ress qui faut
      resssql.push(`${ressource} = ${ressource} - ${currentObject.ressource[ressource] * response}`) // La on complète la requête sql pour les ress
    }

    e.reactions.removeAll();
    if (need.length > 1) return e.edit(need.join('\n')) // la ici on Regarde si il manque des ressource
    con.query(`UPDATE data SET ${resssql.join(',')}, ATK = ${player.data.ATK + (Number(currentObject.ATK) * response)}, DEF = ${player.data.DEF + (Number(currentObject.DEF) * response)}, ${objectName} = ${player.data.dungeon_stone + Number(response)} WHERE userid = ${message.author.id}`) // la on lui boufe les ress et on up la pioche

    e.edit(`${lang.craft.done} ${response}x **${currentObject.name}** !`) // la on lui dit qu'il as eu une nouvelle pioche
    } else if (reaction.emoji.name === '❌') {
      e.edit(`${lang.craft.cancel}`);
    }
    e.reactions.removeAll();
    }) // end collected
  });
  }
}

module.exports.run = async (client, message, args, getPlayer) => {
  //if (message.author.id !== "436310611748454401") return message.channel.send("Commande en maintenance.");
  var con = client.connection;
  const player = await getPlayer(con, message.author.id);
  if (!player) return message.channel.send("You are not registered, please do the `m!village` command to remedy this.");
  const lang = require(`../../utils/text/${player.data.lang}.json`);
  const userid = message.author.id;
  const cooldown = 5000;

  if ((Date.now() - player.data.LastActivity) - cooldown > 0) {
    const timeObj = Date.now() - player.data.LastActivity
    const gagnees = Math.floor(timeObj / cooldown)

    player.data.energy = (player.data.energy || 0) + gagnees
    if (player.data.energy > 100) player.data.energy = 100
    con.query(`UPDATE data SET energy = ${player.data.energy}, LastActivity = ${Date.now()} WHERE userid = ${userid}`)
  }

  var playerClasse;
  if (player.data.classe === "Guerrier") {
    playerClasse = `${Default.emotes.rune_sword} = ${lang.inventory.sword} ]\n\n- [ ${Default.emotes.rune_shield} = ${lang.inventory.shield} ]`;
  } else if (player.data.classe === "Mage") {
    playerClasse = `${Default.emotes.rune_wand} = ${lang.inventory.wand} ]`;
  } else if (player.data.classe === "Chasseur") {
    playerClasse = `${Default.emotes.rune_bow} = ${lang.inventory.bow} ]`;
  }

  var pClasse;
  if (player.data.classe === "Mage") {
    pClasse = `748960787946537030`;
  } else if (player.data.classe === "Chasseur") {
    pClasse = `771331757399212053`;
  }

  const craftEmbed = new Discord.MessageEmbed()
    .setColor(message.member.displayColor)
    .setTitle("CRAFT")
    .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
    .addField("Description", `${lang.craft.craftUP}`)
    .addField("Documentation", `${lang.craft.doc1} :

    - [ ${Default.emotes.tools} = ${lang.inventory.tools} ]
    
    - [ ${Default.emotes.weapons} = ${lang.inventory.weapons} ]
    
    - [ ${Default.emotes.armors} = ${lang.inventory.armors} ]
    
    - [ ${Default.emotes.bag} = ${lang.inventory.obj} ]`)
    .setTimestamp()
    .setFooter(`${client.user.username}`, client.user.avatarURL());

  message.channel.send(craftEmbed).then(async e => {
    await e.react("756140391186694184"); //tools
    await e.react("756140391228637224"); //weapons
    await e.react("756140390796492903"); //armors
    await e.react("748972784432185384"); //objects

    let filter = (reaction, user) => {
      return [`756140391186694184`, `756140391228637224`, `756140390796492903`, `748972784432185384`].includes(reaction.emoji.id) && user.id === message.author.id;
    };

    e.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
    .then(collected => {
      let reaction = collected.first();
      const ToolsEmbed = new Discord.MessageEmbed()
      .setColor(message.member.displayColor)
      .setTitle("CRAFT")
      .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
      .addField("Description", `${lang.craft.craftUP}`)
      .addField("Documentation", `${lang.craft.doc2} :

      - [ ${Default.emotes.rune_pickaxe} = ${lang.inventory.pickaxe} ]`)
      .addField("PS:", "D'autres outils arriveront ~~un jour~~ bientôt.")
      .setTimestamp()
      .setFooter(`${client.user.username}`, client.user.avatarURL());

    if (reaction.emoji.id === `756140391186694184`) {      
      e.delete();

      message.channel.send(ToolsEmbed).then(async t => {
        await t.react("748973331642056764");

        let filter = (reaction, user) => {
          return [`748973331642056764`].includes(reaction.emoji.id) && user.id === message.author.id;
        };
      
        t.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
        .then(async collected => {
          let reaction = collected.first();

          if (reaction.emoji.id === `748973331642056764`) {
            manageCraftTools(client, con, args, player, message, 'pickaxe');
            t.delete();
            }
          }).catch(collected => {
            t.reactions.removeAll();
          })
        })
      } else if (reaction.emoji.id === `756140391228637224`) {
        e.delete();

        const WeaponsEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.craftUP}`)
        .addField("Documentation", `${lang.craft.doc2} :

        - [ ${playerClasse}`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

        message.channel.send(WeaponsEmbed).then(async w => {
          if (player.data.classe === "Guerrier") {
            await w.react("771095091216515123");
            await w.react("771113421202391051")
          } else {
            await w.react(pClasse);
          }    

          let filter = (reaction, user) => {
            return [`771095091216515123`, `771113421202391051`, `748960787946537030`, `771331757399212053`].includes(reaction.emoji.id) && user.id === message.author.id;
          };
        
          w.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
          .then(async collected => {
            let reaction = collected.first();
  
            if (reaction.emoji.id === `771095091216515123`) {
              manageCraftTools(client, con, args, player, message, 'sword');
              w.delete();
            } else if (reaction.emoji.id === `771113421202391051`) {
              manageCraftTools(client, con, args, player, message, 'shield');
              w.delete();
            } else if (reaction.emoji.id === `748960787946537030`) {
              manageCraftTools(client, con, args, player, message, 'wand');
              w.delete();
            } else if (reaction.emoji.id === `771331757399212053`) {
              manageCraftTools(client, con, args, player, message, 'bow');
              w.delete();
            }
          }).catch(collected => {
            w.reactions.removeAll();
          })
        })
      } else if (reaction.emoji.id === `756140390796492903`) {
        e.delete();

        const ArmorsEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.craftUP}`)
        .addField("Documentation", `${lang.craft.doc2} :

        - [ ${Default.emotes.rune_tete} = ${lang.inventory.tete} ]
        - [ ${Default.emotes.rune_epaule} = ${lang.inventory.epaule} ]
        - [ ${Default.emotes.rune_torse} = ${lang.inventory.torse} ]
        - [ ${Default.emotes.rune_poignets} = ${lang.inventory.poignets} ]
        - [ ${Default.emotes.rune_mains} = ${lang.inventory.mains} ]
        - [ ${Default.emotes.rune_taille} = ${lang.inventory.taille} ]
        - [ ${Default.emotes.rune_jambes} = ${lang.inventory.jambes} ]
        - [ ${Default.emotes.rune_pieds} = ${lang.inventory.pieds} ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());
          
        message.channel.send(ArmorsEmbed).then(async a => {
          await a.react("748959964663382106");
          await a.react("748959724170379324");
          await a.react("748960199389479053");
          await a.react("748960470479798324");
          await a.react("748960653930135613");
          await a.react("748961288960606300");
          await a.react("748961288968994888");
          await a.react("748961289145155684");

          let filter = (reaction, user) => {
            return [`748959964663382106`, `748959724170379324`, `748960199389479053`, `748960470479798324`,
          `748961288960606300`, `748960653930135613`, `748961288968994888`, `748961289145155684`].includes(reaction.emoji.id) && user.id === message.author.id;
          };
        
          a.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
          .then(async collected => {
            let reaction = collected.first();
  
            if (reaction.emoji.id === `748959964663382106`) {
              manageCraftArmor(client, con, args, player, message, 'tete');
              a.delete();
            } else if (reaction.emoji.id === `748959724170379324`) {
              manageCraftArmor(client, con, args, player, message, 'epaule');
              a.delete();
            } else if (reaction.emoji.id === `748960199389479053`) {
              manageCraftArmor(client, con, args, player, message, 'torse');
              a.delete();
            } else if (reaction.emoji.id === `748960470479798324`) {
              manageCraftArmor(client, con, args, player, message, 'poignets');
              a.delete();
            } else if (reaction.emoji.id === `748960653930135613`) {
              manageCraftArmor(client, con, args, player, message, 'mains');
              a.delete();
            } else if (reaction.emoji.id === `748961288960606300`) {
              manageCraftArmor(client, con, args, player, message, 'taille');
              a.delete();
            } else if (reaction.emoji.id === `748961288968994888`) {
              manageCraftArmor(client, con, args, player, message, 'jambes');
              a.delete();
            } else if (reaction.emoji.id === `748961289145155684`) {
              manageCraftArmor(client, con, args, player, message, 'pieds');
              a.delete();
            }
          }).catch(err => {
            a.reactions.removeAll();
          })
        })
      } else if (reaction.emoji.id === `748972784432185384`) {
        e.delete();

        const ObjectsEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle("CRAFT")
        .setThumbnail("https://media.discordapp.net/attachments/695902978858680390/715976650197827594/unnamed.png")
        .addField("Description", `${lang.craft.craftUP}`)
        .addField("Documentation", `${lang.craft.doc2} :

        - [ ${Default.emotes.dungeon_stone} = ${lang.inventory.dungeon_stone} ]`)
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());

        message.channel.send(ObjectsEmbed).then(async o => {
          await o.react("748972507427635230");   

          let filter = (reaction, user) => {
            return [`748972507427635230`].includes(reaction.emoji.id) && user.id === message.author.id;
          };
        
          o.awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
          .then(async collected => {
            let reaction = collected.first();
  
            if (reaction.emoji.id === `748972507427635230`) {
              manageCraftObjects(client, con, args, player, message, 'dungeon_stone');
              o.delete();
            }
          }).catch(collected => {
            o.reactions.removeAll();
          })
        })
      }
    }).catch(collected => {
      e.reactions.removeAll();
    })
  })
};   

module.exports.help = {
    name: "craft",
    description_fr: "Pour fabriquer des outils",
    description_en: "For making tools",
    usage_fr: "<outil>",
    usage_en: "<tool>",
    category: "RPG",
    aliases: ["cra"]
};
