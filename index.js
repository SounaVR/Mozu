require('dotenv').config();
const { getUser, getPlayer }      = require("./utils/u");
const { sep } 					  = require("path");
const { success, error, warning } = require("log-symbols");
const fs	= require('fs'),
	path	= require('path'),
	moment  = require('moment'),
	cron    = require('cron'),
	Discord = require("discord.js"),
	config  = require("./utils/config"),
  	sql     = fs.readFileSync('./sql/schema.sql').toString(),
  	mysql   = require('mysql');

const client = new Discord.Client({
	disableMentions: "everyone",
	restTimeOffset: 0
});

moment.locale('fr');

client.config = config;
["commands", "aliases"].forEach(x => client[x] = new Discord.Collection());

const con = mysql.createConnection({
	multipleStatements: true,
	encoding: 'utf8',
	charset: 'utf8mb4',
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

client.on('ready', async () => {
	client.connection = con;

	con.query(sql, function (err) {
		if (err) throw err;
	});

	const systemlogs = client.channels.cache.find(ch => ch.id === "698861927652261988");
	const rdy = client.channels.cache.find(ch => ch.id === "689876186599653512");

	const load = (dir = "./commands/") => {
		fs.readdirSync(dir).forEach(dirs => {
			const commands = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));

			for (const file of commands) {
				const pull = require(`${dir}/${dirs}/${file}`);
				if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
					if (client.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}.`);
					client.commands.set(pull.help.name, pull);
					console.log(`${success} Loaded command ${pull.help.name} in ${dirs}.`);
				} else {
					console.log(`${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
					continue;
				}
				if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
					pull.help.aliases.forEach(alias => {
						if (client.aliases.get(alias)) return console.warn(`${warning} Two commands or more commands have the same aliases ${alias}`);
						client.aliases.set(alias, pull.help.name);
					});
				}
			}
		});
	};
	load();

	const embed = new Discord.MessageEmbed()
		.setTitle(`[SYSTEM START] Log du ${moment().format('DD/MM/YYYY | HH:mm:ss')}`)
		.setDescription(`${client.user.username} just started !\n${client.user.username} vient de démarrer !`)
		.setColor("#1DCC8F")
	systemlogs.send(embed);

	const { exec } = require ('child_process');
	const backupsChannel = client.channels.cache.find(ch => ch.id === "804174293453766679");
	// -----------------
	// CRON MEMO
	// *  *  *  *  *  *
	// |  |  |  |  |  |
	// |  |  |  |  |  jour de la semaine
	// |  |  |  |  mois
	// |  |  |  jour du mois
	// |  |  heures
	// |  minutes
	// secondes (optionnelles)

	let dailyReset = new cron.CronJob('00 00 * * *', async () => {
		try {
			exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u ReallySouna -p ${process.env.BACKUP_PASSWORD}`)
			con.query(`UPDATE data SET LastRep = 0, LastDaily = 0`)
			backupsChannel.send(`🟢 Daily backup done.`)
		} catch (error) {
			backupsChannel.send(`🔴 An error occurred. Check the console.`)
			if (error) throw error;
		}
	});
	
	let weekReset = new cron.CronJob('00 00 * * 1', async () => {
		if (fs.existsSync('./backups')) {
			exec("rm -r backups/");
			exec("mkdir backups");
			exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u ReallySouna -p ${process.env.BACKUP_PASSWORD}`)
			backupsChannel.send(`🟢 Weekly backup done.`);
		} else {
			exec("mkdir backups");
			exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u ReallySouna -p ${process.env.BACKUP_PASSWORD}`)
			backupsChannel.send(`🟢 Weekly backup done.`);
		}
	});

	dailyReset.start();
	weekReset.start();

	setInterval(function () {
		con.query('SELECT 1');
	}, 2, 52e+7);

	await client.user.setActivity(`m!profile`, { type: "PLAYING" });

	console.log(`${client.user.username} is ready !`);
	rdy.send(`✅ Bot connecté et prêt !`);
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

	const player = await getPlayer(con, message.author.id);
	const blacklist = new Discord.MessageEmbed()
        .setColor("#e31212")
        .setDescription("ERROR: You are banned from the bot by the owner.\nFor more information, please contact **Souna#2424**.")

    if (!player || player.data.ban == "0") {
		if (client.commands.has(cmd)) command = client.commands.get(cmd);
		else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));

        if (command) command.run(client, message, args, getPlayer, getUser);
        if (player) con.query(`UPDATE data SET cmd = ${player.data.cmd + Number(1)} WHERE userid = ${message.author.id}`);
    } else if (player.data.ban == "1") {
        return message.channel.send(blacklist);
    }
});

client.on("userUpdate", async function(oldUser, newUser) {
    const player = await getPlayer(con, oldUser.id);
	if (player) {
		con.query(`UPDATE data SET username = "${newUser.username + "#" + newUser.discriminator}" WHERE userid = ${oldUser.id}`);
	} else return;
});

// all guilds event need edit for guild handler with mysql

client.on('guildMemberAdd', member => {
	const guild = member.guild;
	if (guild.id === "689471316570406914") {
		client.channels.cache.get("785207465784115239").setName(`Discord > ${member.guild.members.cache.filter(m => !m.user.bot).size} Members`);
		const channel = client.channels.cache.find(channel => channel.id === "689471317203877893");
		channel.send(`Bienvenue ${member} ! N'hésite pas à lire <#774318768833953812> pour bien débuter !`)
		member.roles.set(['691678064282697788'])
	}
});

client.on('guildMemberRemove', member => {
	const guild = member.guild;
	if (guild.id === "689471316570406914") {
		client.channels.cache.get("785207465784115239").setName(`Discord > ${member.guild.members.cache.filter(m => !m.user.bot).size} Members`);
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
		} else return;
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
		} else return;
	  } else return;
	}
});

client.on('messageUpdate', (message, newMessage) => {
    if (!message.guild || message.channel.type == "dm") return;
    if (message.guild.id === "689471316570406914") {
        if (message.author.bot) return;
        const channel = client.channels.cache.get('744949137560174702');
        if (channel) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Edited Message')
            .setColor("#0183c2")
            .addField('Old message', `${message}`)
            .addField('New message', newMessage)
            .addField('Author', `${message.author.tag} (${message.author.id})`, true)
            .addField('Channel', `${message.channel.name} (${message.channel.id})`, true)
            .setTimestamp();
        if (message.attachments.array().length > 0) {
            const result = message.attachments.array()
            embed.setImage(result[0].proxyURL)
        }
        channel.send(embed);
    } else return;
  } else return;
});

client.login(process.env.BOT_TOKEN);
