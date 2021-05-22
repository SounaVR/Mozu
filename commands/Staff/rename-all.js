exports.run = async (client, message, args, getPlayer, getUser) => {
    async function verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
        const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui', 'はい', 'correct'];
        const no = ['no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off'];
        const filter = res => {
            const value = res.content.toLowerCase();
            return (user ? res.author.id === user.id : true)
                && (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
        };
        const verify = await channel.awaitMessages(filter, {
            max: 1,
            time
        });
        if (!verify.size) return 0;
        const choice = verify.first().content.toLowerCase();
        if (yes.includes(choice) || extraYes.includes(choice)) return true;
        if (no.includes(choice) || extraNo.includes(choice)) return false;
        return false;
    }

    try {
        var nickname;
        if (args[0]) {
            nickname = args[0];
        } else {
            nickname = null;
        }
        await message.reply(
            `Are you sure you want to ${nickname ? `rename everyone to **${nickname}**` : 'remove all nicknames'}?`
        );
        const verification = await verify(message.channel, message.author);
        if (!verification) return message.say('Aborted.');
        await message.reply('Fetching members...');
        await message.guild.members.fetch();
        await message.reply('Fetched members! Renaming...');
        let i = 0;
        for (const member of message.guild.members.cache.values()) {
            try {
                await member.setNickname(nickname);
            } catch {
                i++;
                continue;
            }
        }
        if (!nickname) return message.reply('Successfully removed all nicknames!');
        return message.reply(`Successfully renamed all but ${i} member${i === 1 ? '' : 's'} to **${nickname}**!`);
    } catch (err) {
        return message.reply(`Failed to rename everyone: \`${err.message}\``);
    }
};

exports.help = {
    name: "rename-all",
    description_fr: "Pour rename tout le monde",
    description_en: "For rename everyone",
    usage_fr: "(pseudo)",
    usage_en: "(nickname)",
    category: "Staff",
    aliases: ["rename"]
};
