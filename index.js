require('dotenv').config();
const fs = require('fs')
const cron = require('cron');
const Discord = require("discord.js");
const { sep } = require("path");
const { success, error, warning } = require("log-symbols");
const { version } = require('./package');
const client = new Discord.Client({
	disableMentions: "everyone",
	restTimeOffset: 25
});
const config = require("./utils/config");
client.config = config;
["commands", "aliases"].forEach(x => client[x] = new Discord.Collection());

const getPlayer = require("./functions/getPlayer.js");
const getUser = require("./functions/getUser.js");

var d = new Date();
var curr_date = `0${d.getDate() + 1}`.slice(-2)
var curr_month = `0${d.getMonth() + 1}`.slice(-2)
var curr_year = d.getFullYear()
var curr_hour = `0${d.getHours()}`.slice(-2)
var curr_min = `0${d.getMinutes()}`.slice(-2)
var curr_sec = `0${d.getSeconds()}`.slice(-2)

client.on('ready', async () => {
	var systemlogs = client.channels.cache.find(channel => channel.id === "698861927652261988");
	var rdy = client.channels.cache.find(channel => channel.id === "689876186599653512");

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
					if (client.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}.`);
					// we add the the comamnd to the collection, Map.prototype.set() for more info
					client.commands.set(pull.help.name, pull);
					// we log if the command was loaded.
					console.log(`${success} Loaded command ${pull.help.name} in ${dirs}.`);
				}
				else {
				// we check if the command is loaded else throw a error saying there was command it didn't load
					console.log(`${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
					// we use continue to load other commands or else it will stop here
					continue;
				}
				// we check if the command has aliases, is so we add it to the collection
				if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
					pull.help.aliases.forEach(alias => {
						// we check if there is a conflict with any other aliases which have same name
						if (client.aliases.get(alias)) return console.warn(`${warning} Two commands or more commands have the same aliases ${alias}`);
						client.aliases.set(alias, pull.help.name);
					});
				}
			}
		});
	};
	// we call the function to all the commands.
	load();

	const mysql = require('mysql');
	const con = mysql.createConnection({
		encoding: 'utf8',
    charset: 'utf8mb4',
		host: "localhost",
		user: "ReallyMozu",
		password: process.env.DB_PASS,
		database: "Mozu",
		multipleStatements: true
	})

	client.connection = con

	let embed = new Discord.MessageEmbed()
	.setTitle(`[SYSTEM START] Log du ${curr_date}/${curr_month}/${curr_year} | ${curr_hour}:${curr_min}:${curr_sec}`)
	.setDescription(`${client.user.username} vient de démarrer !`)
	.setColor("#1DCC8F")
	.addField("État de la Database:", "Connectée.");
	const sql = `CREATE TABLE IF NOT EXISTS data (username text, userid bigint, lang text, money bigint, LastDaily bigint, daily bigint, LastHR bigint,
	LastActivity bigint, LastRep bigint, rep bigint, classe text, pickaxe bigint, rune_pickaxe bigint, energy bigint, XP bigint, level bigint,
	dungeon_stone bigint, stone bigint, coal bigint, copper bigint, iron bigint, gold bigint, malachite bigint, sword bigint, rune_sword bigint,
	shield bigint, rune_shield bigint, wand bigint, rune_wand bigint, bow bigint, rune_bow bigint, PV bigint, mana bigint, ATK bigint, DEF bigint,
	chest_d bigint, chest_c bigint, chest_b bigint, chest_a bigint, chest_s bigint, tete bigint, rune_tete bigint, epaule bigint, rune_epaule bigint,
	torse bigint, rune_torse bigint, poignets bigint, rune_poignets bigint, mains bigint, rune_mains bigint, taille bigint, rune_taille bigint,
	jambes bigint, rune_jambes bigint, pieds bigint, rune_pieds bigint, ench_pickaxe bigint, ench_sword bigint, ench_shield bigint, ench_wand bigint,
	ench_bow bigint, ench_tete bigint, ench_epaule bigint, ench_torse bigint, ench_poignets bigint, ench_mains bigint, ench_taille bigint, ench_jambes bigint,
	ench_pieds bigint)`;

	con.query(sql, function (err) {
		if (err) throw err;
		systemlogs.send(embed);
	});

	let scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {
		return con.query(`UPDATE data SET LastRep = 0, daily = 0`)
	});
	scheduledMessage.start()

	setInterval(function () {
    con.query('SELECT 1');
	}, 2,52e+7);
	
	await client.user.setActivity(`Rework soon`, { type: "WATCHING" });
	await client.user.setStatus("idle");

	console.log(`${client.user.username} is ready !`);
	rdy.send(`✅ Bot connecté et prêt !`);
});

//console chatter
let y = process.openStdin()
y.addListener("data", res => {
	let x = res.toString().trim().split(/ +/g)
	client.channels.cache.find(channel => channel.id === "689876186599653512").send(x.join(" "));
});

client.on("message", async message => {
	const prefix = client.config.prefix;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	let command;

	if (message.channel.type == "dm") {
			const channel = client.channels.cache.get('744953016339136562');
			if (channel) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Message')
				.setColor("#0183c2")
				.addField('Author', `${message.author.tag} (${message.author.id})`, true)
				.setDescription(message.content)
				.setTimestamp();
			if (message.attachments.array().length > 0) {
				const result = message.attachments.array()
				embed.setImage(result[0].proxyURL)
			 }
			channel.send(embed);
		} else {
			return message.channel.send("Deleted message log channel not found.");
		}
	}
	if (message.author.bot || !message.guild) return;

	if (!message.member) message.member = await message.guild.fetchMember(message.author);

	if (!message.content.toLowerCase().startsWith(prefix)) return;
	//if (message.author.id !== "436310611748454401") return message.channel.send("Une réécriture va avoir lieu prochainement.\nLa database est bien enregistrée donc vous ne perdrez pas vos données, merci de votre compréhension.");
// 	if (!client.config.owners.includes(message.author.id)) {
// 		message.delete();
// 		return message.channel.send("⚙️ Maintenance en cours.")
// 	.then(msg => {
// 		msg.delete({ timeout: 8000 })
// 	});
// }

	if (client.commands.has(cmd)) command = client.commands.get(cmd);
	else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args, getPlayer, getUser);
});
client.on('guildMemberAdd', member => {
	const guild = member.guild;
	if (guild.id === "689471316570406914") {
		const channel = client.channels.cache.find(channel => channel.id === "689471317203877893");
		channel.send(`Bienvenue ${member} ! N'hésite pas à lire <#774318768833953812> pour bien débuter !`)
		member.roles.set(['691678064282697788'])
	}
});

client.on('guildMemberRemove', member => {
	const guild = member.guild;
	if (guild.id === "689471316570406914") {
		const channel = client.channels.cache.find(channel => channel.id === "689471317203877893");
		channel.send(`L'utilisateur ${member}/${member.user.username} est parti.`)
	}
});

client.on('messageDelete', message => {
	if (message.channel.type == "dm") {
			const channel = client.channels.cache.get('744953016339136562');
			if (channel) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Deleted Message')
				.setColor("#0183c2")
				.addField('Author', `${message.author.tag} (${message.author.id})`, true)
				.addField('Channel', `In DM`, true)
				.setDescription(message.content)
				.setTimestamp();
			if (message.attachments.array().length > 0) {
				const result = message.attachments.array()
				embed.setImage(result[0].proxyURL)
			 }
			channel.send(embed);
		} else {
			return message.channel.send("Deleted message log channel not found.");
		}
	}
	if (!message.guild) return;
    if (!message.partial) {
		if (message.guild.id === "689471316570406914") {
			if (message.author.bot) return;
			const channel = client.channels.cache.get('744949137560174702');
			if (channel) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Deleted Message')
				.setColor("#0183c2")
				.addField('Author', `${message.author.tag} (${message.author.id})`, true)
				.addField('Channel', `${message.channel.name} (${message.channel.id})`, true)
				.setDescription(message.content)
				.setTimestamp();
			if (message.attachments.array().length > 0) {
				const result = message.attachments.array()
				embed.setImage(result[0].proxyURL)
			}
			channel.send(embed);
		} else {
		return message.channel.send("Deleted message log channel not found.");
		}
	  } else return;
	}
});

client.login(process.env.BOT_TOKEN);
