const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Affiche la photo de profil de quelqu'un ou vous-même",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un utilisateur.",
            type: "USER",
            required: false
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        let target = interaction.options.getUser("membre");
        if (!target) target = interaction.user;

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setImage(target.avatarURL({ dynamic: true, size: 512 })) 
            .setDescription("Photo de profil de " + `${target}`);
    
        interaction.reply({ embeds: [embed] })
    }
};