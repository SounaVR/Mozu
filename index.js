require('dotenv').config();
const { DB_HOST, DB_USER, DB_NAME, DB_PASS, BOT_TOKEN } = process.env
const { success, error, warning } = require("log-symbols");
const { getUser, getPlayer } = require("./utils/u");
const { sep } = require("path");
const roleClaim = require("./utils/reaction_role/role-claim");
const moment  = require("moment"),
Discord   = require("discord.js"),
cron	  = require("cron"),
config    = require("./utils/config"),
mysql     = require("mysql"),
fs		  = require("fs");

const arraydebg = ["data", "ress", "items", "enchant", "prospect", "slots", "stats"];

const client = new Discord.Client({
	disableMentions: "everyone",
	restTimeOffset: 250
});
require('discord-buttons')(client)

moment.locale("fr");

client.config = config;
["commands", "aliases"].forEach(x => client[x] = new Discord.Collection());

const con = mysql.createConnection({
	multipleStatements: true,
	encoding: 'utf8',
	charset: 'utf8mb4',
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASS,
	database: DB_NAME
});

client.on('ready', async () => {
    const rdy = client.channels.cache.find(channel => channel.id === "858815406508605490");
    const start = client.channels.cache.find(channel => channel.id === "827453929955786794");
    const backup = client.channels.cache.find(channel => channel.id === "827453893205688350");
	client.connection = con;

    //initialisation des db
    arraydebg.forEach(async element => {
        const thing = fs.readFileSync(`./sql/${element}.sql`).toString();
        con.query(thing, function (err) {
            if (err) throw err;
        });
    });

	const load = (dir = "./commands/") => {
		fs.readdirSync(dir).forEach(dirs => {
			const commands = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(f => f.endsWith(".js"));

			for (const f of commands) {
				const pull = require(`${dir}/${dirs}/${f}`);
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
			exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u Souna -p ${process.env.BACKUP_PASSWORD}`);
			con.query(`UPDATE data SET LastRep = 0, LastDaily = 0`);
            backup.send(`🟢 Daily backup done.`);
        } catch (error) {
            backup.send("🔴 An error occurred.");
			if (error) throw error;
		}
	});
	
	let weekReset = new cron.CronJob('00 00 * * 1', async () => {
        try {
            if (fs.existsSync('./backups')) {
                exec("rm -r backups/");
                exec("mkdir backups");
                exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u Souna -p ${process.env.BACKUP_PASSWORD}`);
                backup.send(`🟢 Weekly backup done.`);
            } else {
                exec("mkdir backups");
                exec(`mysqldump --all-databases --single-transaction --quick --lock-tables=false > ./backups/full-backup-$(date +%F).sql -u Souna -p ${process.env.BACKUP_PASSWORD}`);
                bakup.send(`🟢 Weekly backup done.`);
            }
        } catch (error) {
            backup.send("🔴 An error occurred.");
            if (error) throw error;
        }
	});

	dailyReset.start();
	weekReset.start();
	//roleClaim(client);

    //garder la db allumée
	setInterval(function () {
		con.query('SELECT 1');
	}, 2, 52e+7);

	await client.user.setActivity(`m!profile`, { type: "WATCHING" });

    const embed = new Discord.MessageEmbed()
		.setTitle(`[SYSTEM START] Log du ${moment().format('DD/MM/YYYY | HH:mm:ss')}`)
		.setDescription(`${client.user.username} just started !`)
		.setColor("#1DCC8F")
	start.send(embed);

	console.log(`${client.user.username} is ready !`);
	rdy.send(`✅ Bot connecté et prêt !`);
});

client.on("message", async message => {
	const owner = client.users.cache.find(user => user.id === client.config.owners[0]);
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
        .setDescription(`ERROR: You are banned from the bot by the Mozu team.\nFor more information, please contact **${owner.tag}**.`)

    if (!player || player.data.ban == "0") {
        if (client.commands.has(cmd)) command = client.commands.get(cmd);
            else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));

            if (command) command.run(client, message, args, getPlayer, getUser);
        if (player) {
            const Items = require(`./utils/items/${player.data.lang}.json`);
            const maxEnergy = Items.objects.ring[player.items.ring].energy;
            const cooldown = player.data.energyCooldown;
            con.query(`UPDATE stats SET cmd = ${player.stats.cmd + Number(1)} WHERE userid = ${message.author.id}`);

            if ((Date.now() - player.data.lastActivity) - cooldown > 0) {
                const timeObj = Date.now() - player.data.lastActivity;
                const gagnees = Math.floor(timeObj / cooldown);
        
                player.ress.energy = (player.ress.energy || 0) + gagnees;
                if (player.ress.energy > maxEnergy) player.ress.energy = maxEnergy;
                con.query(`UPDATE ress SET energy = ${player.ress.energy} WHERE userid = ${message.author.id}`);
                con.query(`UPDATE data SET lastActivity = ${Date.now()} WHERE userid = ${message.author.id}`);
            }
        }
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

client.on('guildMemberAdd', member => {
	const guild = member.guild;
	if (guild.id === "689471316570406914") {
		//client.channels.cache.get("785207465784115239").setName(`Discord > ${member.guild.members.cache.filter(m => !m.user.bot).size} Members`);
		const channel = client.channels.cache.find(channel => channel.id === "689471317203877893");
		channel.send(`Bienvenue à ${member} !`)
		member.roles.set(['691678064282697788'])
	}
});

client.on('guildMemberRemove', member => {
	const guild = member.guild;
	if (guild.id === "689471316570406914") {
		//client.channels.cache.get("785207465784115239").setName(`Discord > ${member.guild.members.cache.filter(m => !m.user.bot).size} Members`);
		const channel = client.channels.cache.find(channel => channel.id === "689471317203877893");
		channel.send(`L'utilisateur ${member}/${member.user.username}#${member.user.discriminator} est parti.`);
	}
});

client.on('messageDelete', message => {
	if (!message.guild) return;
    if (!message.partial) {
		if (message.guild.id === "689471316570406914") {
			if (message.author.bot) return;
			if (message.length <= 0) return;
			const channel = client.channels.cache.get('827457768277409792');
			const privateChannel = client.channels.cache.get('845528260044390410');
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
			privateChannel.send(embed);
		} else return;
	  } else return;
	}
});

client.on('messageUpdate', (message, newMessage) => {
    if (!message.guild || message.channel.type == "dm") return;
    if (message.guild.id === "689471316570406914") {
        if (message.author.bot) return;
		if (message.length <= 0) return;
        const channel = client.channels.cache.get('827457768277409792');
		const privateChannel = client.channels.cache.get('845528370774933524');
        if (channel) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Edited Message')
                .setColor("#0183c2");
                if (message) embed.addField('Old message', `${message}`)
                else embed.addField('Old message', `empty`)
                embed.addField('New message', newMessage)
                embed.addField('Author', `${message.author.tag} (${message.author.id})`, true)
                embed.addField('Channel', `${message.channel.name} (${message.channel.id})`, true)
                embed.setTimestamp();
            if (message.attachments.array().length > 0) {
                const result = message.attachments.array()
                embed.setImage(result[0].proxyURL)
            }
            channel.send(embed);
			privateChannel.send(embed);
        } else return;
    } else return;
});

client.on('clickButton', async (button) => {
	await button.reply.defer();
});

client.login(BOT_TOKEN);