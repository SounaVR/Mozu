const { CommandInteraction, Util } = require('discord.js');

module.exports = {
    name: 'steal-emoji',
    description: 'Ajoute un emoji au serveur',
    permission: 'MANAGE_EMOJIS_AND_STICKERS',
    options : [
        {
            name: 'emoji',
            description: 'Mettez le lien ou l\'emoji à ajouter',
            type: 'STRING',
            required: true
        },
        {
            name: 'name',
            description: 'Le nom de l\'emoji à ajouter',
            type: 'STRING',
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const { guild, options } = interaction;
        const rawEmoji = options.getString('emoji');
        const name = options.getString('name');
        
        const parsedEmoji = Util.parseEmoji(rawEmoji);

        if (parsedEmoji.id) {
            // .gif .png
            const extension = parsedEmoji.animated ? '.gif' : '.png';
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;

            guild.emojis.create(url, name)
                .then((emoji) => interaction.reply({ content: `Added: \`${emoji.name}\` ${emoji}` }));
        } else {
            const id = rawEmoji.match(/\d+/)
            const extension = rawEmoji.match(/.gif/) ? '.gif' : '.png';
            const url = `https://cdn.discordapp.com/emojis/${id + extension}`;

            guild.emojis.create(url, name)
                .then((emoji) => interaction.reply({ content: `Added: \`${emoji.name}\` ${emoji}` }));
        }
    }
}