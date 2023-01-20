const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const users = require("../users.json");

module.exports.run = async (bot, message, args) => {

	let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

	if (!users[message.author.id]) {
		users[message.author.id] = {
			valid: 0
		};
	}
	
	let curvalid = users[message.author.id].valid;

	if (curvalid === 0) {
		users[message.author.id].valid = curvalid + 1;
		fs.writeFile("./users.json", JSON.stringify(users),  (err) => {
          if (err) console.log(err)
        });
        message.reply("vous êtes maintenant enregistré, bon jeu !");
	} else if (curvalid === 1) {
		return message.reply("vous êtes déjà enregistré.");
	}
}

module.exports.help = {
	name: "register",
    aliases: []
}