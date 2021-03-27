require('dotenv').config();
const { getUser, getPlayer }      = require("./utils/u");
const { sep } 					  = require("path");
const { success, error, warning } = require("log-symbols");
const fs	 = require('fs'),
	moment   = require('moment'),
	cron     = require('cron'),
	Discord  = require("discord.js"),
	config   = require("./utils/config"),
  	mysql    = require('mysql');
const arraydebg = ["data", "ress", "items", "enchant", "prospect", "stats"];

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
    const rdy = client.channels.cache.find(ch => ch.id === "689876186599653512");
	client.connection = con;

    arraydebg.forEach(async element => {
        const thing = fs.readFileSync(`./sql/${element}.sql`).toString();
        con.query(thing, function (err) {
            if (err) throw err;
        });
    });

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

	const { exec } = require ('child_process');
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
			exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u Souna -p ${process.env.BACKUP_PASSWORD}`)
			con.query(`UPDATE data SET LastRep = 0, LastDaily = 0`)
		} catch (error) {
			if (error) throw error;
		}
	});
	
	let weekReset = new cron.CronJob('00 00 * * 1', async () => {
		if (fs.existsSync('./backups')) {
			exec("rm -r backups/");
			exec("mkdir backups");
			exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u Souna -p ${process.env.BACKUP_PASSWORD}`)
		} else {
			exec("mkdir backups");
			exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u Souna -p ${process.env.BACKUP_PASSWORD}`)
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

	if (message.author.bot || !message.guild) return;

	if (!message.member) message.member = await message.guild.fetchMember(message.author);

	if (!message.content.toLowerCase().startsWith(prefix)) return;

	const player = await getPlayer(con, message.author.id);
	const blacklist = new Discord.MessageEmbed()
        .setColor("#e31212")
        .setDescription("ERROR: You are banned from the bot by the Mozu team.\nFor more information, please contact **Souna#2424**.")

    if (!player || player.data.ban == "0") {
        if (client.commands.has(cmd)) command = client.commands.get(cmd);
            else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));

            if (command) command.run(client, message, args, getPlayer, getUser);
        if (player) {
            const cooldown = 5000;
            con.query(`UPDATE stats SET cmd = ${player.stats.cmd + Number(1)} WHERE userid = ${message.author.id}`);

            if ((Date.now() - player.data.lastActivity) - cooldown > 0) {
                const timeObj = Date.now() - player.data.lastActivity;
                const gagnees = Math.floor(timeObj / cooldown);
        
                player.ress.energy = (player.ress.energy || 0) + gagnees;
                if (player.ress.energy > 100) player.ress.energy = 100;
                con.query(`UPDATE ress SET energy = ${player.ress.energy} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE data SET lastActivity = ${Date.now()} WHERE userid = ${message.author.id}`);
            }
        }
    } else if (player.data.ban == "1") {
        return message.channel.send(blacklist);
    }
});

client.login(process.env.BOT_TOKEN);