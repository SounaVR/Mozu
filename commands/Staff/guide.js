exports.run = async (client, message, args, getPlayer, getUser) => {
    if (!client.config.owners.includes(message.author.id)) return message.react("❌");

    message.author.send(`Guide détaillé des commandes Staff :
    **m!ban [@user]** : Quand vous mentionnez quelqu'un, il se verra banni du bot. En d'autres mots, il pourra plus exécuter de commandes du tout avant l'unban.
    **m!unban [@user]** : Fait l'exact inverse du ban.
    **m!cheat [@user] [set/add] [data/ress/items/enchant/prospect/stats] [colonne (<#795598892053561364>)] [valeur]** : Modifie une donnée dans la database.
    ⚠ Ne modifiez surtout pas "uuid" et "userid", merci. ⚠
    **m!eval [code]** : Permet "d'évaluer" du code, comme changer le pseudo de quelqu'un ou autre, à utiliser uniquement en cas de nécessité.*
    **m!exec [commande]** : Owner only, c'est des commandes dans le vps (vous pouvez carrément le reboot si vous y avez accès).
    **m!reboot** : Redémarre le bot.
    **m!reload [commande]** : Recharge une commande.
    **m!sql [requête]** : Owner only, permet de faire des requêtes sql à la manière du m!cheat mais en plus compliqué.
    
    Pour voir les aliases, faites m!help [commande].`);
    return message.react("✅");
};

exports.help = {
    name: "guide",
    description_fr: "Envoie une description plus détaillée sur les commandes staff",
    description_en: "Send a more detailed description of the staff commands",
    category: "Staff"
};
