const { ApplicationCommandOptionType, parseEmoji } = require('discord.js');

module.exports = {
    data: {
        name: 'steal-emoji',
        description: 'add an emoji to the server',
        default_member_permissions: (1 << 30),
        options : [
            {
                name: 'emoji',
                description: 'put the link of the emoji',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'name',
                description: 'name of the emoji',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;
        const rawEmoji = options.getString('emoji');
        const name = options.getString('name');
        
        const parsedEmoji = parseEmoji(rawEmoji);

        if (parsedEmoji.id) {
            // .gif .png
            const extension = parsedEmoji.animated ? '.gif' : '.png';
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;

            guild.emojis.create({attachment: url, name: name})
                .then((emoji) => interaction.reply({ content: `Added: \`${emoji.name}\` ${emoji}` }));
        } else {
            const id = rawEmoji.match(/\d+/)
            const extension = rawEmoji.match(/.gif/) ? '.gif' : '.png';
            const url = `https://cdn.discordapp.com/emojis/${id + extension}`;

            guild.emojis.create({ attachment: url, name: name})
                .then((emoji) => interaction.reply({ content: `Added: \`${emoji.name}\` ${emoji}` }));
        }
    }
}