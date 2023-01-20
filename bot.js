require('dotenv').config();
// Requring the packages and modules required
// All the methods used here are destructing.
const fs = require('fs')
const Discord = require("discord.js");
const { sep } = require("path");
const { success, error, warning } = require("log-symbols"); // npm i log-symbols or yarn add log-symbols
// we require the config file
const config = require("./utils/config");

const sqlite = require("sqlite3").verbose();

// Creating a instance of Client.
const bot = new Discord.Client();

// Attaching Config to bot so it can be accessed anywhere.
bot.config = config;

// Creating command and aliases collection.
["commands", "aliases"].forEach(x => bot[x] = new Discord.Collection());

function catchErr (err, message) {
	bot.channels.cache.get("698861927652261988").send("There was an error at channel " + message.channel + " in guild " + message.guild + " <@436310611748454401> <@303597938083627008>");
	bot.channels.cache.get("698861927652261988").send("Error : ```" + err + "```");
}

// This keeps the client running 24/7

// const http = require("http");
// const express = require("express");
// const app = express();

// app.get("/", (request, response) => {
//   response.sendStatus(200);
// });

// var server = http.createServer(app);
// const listener = server.listen(process.env.PORT, function() {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
// setInterval(() => {
//   http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
// }, 280000);

/**
 * Ready event
 * @description Event is triggred when bot enters ready state.
 */
var d = new Date();
var curr_date = d.getDate();
var curr_month = `0${d.getMonth() + 1}`.slice(-2)
var curr_year = d.getFullYear();

var curr_hour = `0${d.getHours()}`.slice(-2)
var curr_min = `0${d.getMinutes()}`.slice(-2)
var curr_sec = `0${d.getSeconds()}`.slice(-2)

bot.on('ready', async () => {
	var systemlogs = bot.channels.cache.find(channel => channel.id === "698861927652261988");

	// A function to load all the commands.
	const load = (dir = "./commands/") => {

		fs.readdirSync(dir).forEach(dirs => {
		// we read the commands directory for sub folders and filter the files with name with extension .js
			const commands = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));

			// we use for loop in order to get all the commands in sub directory
			for (const file of commands) {
			// We make a pull to that file so we can add it the bot.commands collection
				const pull = require(`${dir}/${dirs}/${file}`);
				// we check here if the command name or command category is a string or not or check if they exist
				if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
					if (bot.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}.`);
					// we add the the comamnd to the collection, Map.prototype.set() for more info
					bot.commands.set(pull.help.name, pull);
					// we log if the command was loaded.
					console.log(`${success} Loaded command ${pull.help.name} in ${dirs}.`);
				}
				else {
				// we check if the command is loaded else throw a error saying there was command it didn't load
					console.log(`${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
					systemlogs.send(`:x: Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string <@436310611748454401> <@303597938083627008>`)
					// we use continue to load other commands or else it will stop here
					continue;
				}
				// we check if the command has aliases, is so we add it to the collection
				if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
					pull.help.aliases.forEach(alias => {
						// we check if there is a conflict with any other aliases which have same name
						if (bot.aliases.get(alias)) return console.warn(`${warning} Two commands or more commands have the same aliases ${alias}`);
						bot.aliases.set(alias, pull.help.name);
					});
				}
			}
		});
	};
	// we call the function to all the commands.
	load();

	console.log(`${bot.user.username} is ready !`);

	// logs when the bot is online

   let embed = new Discord.MessageEmbed()
   .setTitle(`[SYSTEM] Log ${curr_date}/${curr_month}/${curr_year} | ${curr_hour}:${curr_min}:${curr_sec}`)
   .setDescription("ReallyMozu vient de démarrer !")
   .setColor("#1DCC8F");
   systemlogs.send(embed);

    bot.user.setStatus('dnd')
    //setInterval(() => {
      //bot.user.setActivity(`${bot.guilds.size} servers & ${bot.users.size} users | r!help`, {type: "WATCHING"});
      bot.user.setActivity("nous sommes en guerre", {type: "WATCHING"});
    //}, 15000);

	// bêta content
	let db = new sqlite.Database("./data/db.db", sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
	db.run(`CREATE TABLE IF NOT EXISTS mine(userid int, username TEXT, XP int, level int, Pioche int, cailloux int,
		cuivre int, fer int, gold int, malachite int)`);
	db.run(`CREATE TABLE IF NOT EXISTS data(userid int, username TEXT, Money int,
		LastDaily int, LastHR int, Classe int, weapon int, shield int, stick int, bow int,
		PV int, Mana int, ATK int, DEF int, LastActivity int,
		Energy int, Rep int, LastRep int)`);

	// updates content
	/* orichalque INTEGER, cobalt INTEGER,
	argent INTEGER, fer_nain INTEGER, argent_lycanthrope INTEGER, or_elfe INTEGER,
	emeraude INTEGER, saphir INTEGER, rubis INTEGER, diamant INTEGER, joyau_pur INTEGER,
	ebonite INTEGER, ecaille_de_dragon_ancien INTEGER, adamantium INTEGER)`);*/

	// top.gg
//   setInterval(() => {
//         dbl.postStats(bot.guilds.size);
//     }, 1800000);
});

/**
 * Message event
 * @param message - The message parameter for this event.
 */
bot.on("message", async message => {

	const prefix = bot.config.prefix;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	let command;

	if (message.author.bot || !message.guild) return;

	// If the message.member is uncached, message.member might return null.
	// This prevents that from happening.
	// eslint-disable-next-line require-atomic-updates
	if (!message.member) message.member = await message.guild.fetchMember(message.author);

	if (!message.content.toLowerCase().startsWith(prefix)) return;

	if (cmd.length === 0) return;
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
	else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));

    if (command) command.run(bot, message, args);
});

// Here we login the bot with the porvided token in the config file, as login() returns a Promise we catch the error.
bot.login(bot.config.token).catch(console.error());
