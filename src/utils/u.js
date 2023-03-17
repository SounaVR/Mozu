const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { format } = require("util");

module.exports = (client) => ({
    query: client.connection.query.bind(client.connection),
   
    /**
     * @param {userid} player
     * @example
     * const player = getPlayer(con, interaction.user.id);
     * console.log(player.data.userid);
     * @returns {Promise<object>} Returns the whole desired column from anywhere in the code
     */
    getPlayer: async function(player) {
        const result = {};
        result.data = await client.connection.query(`SELECT * FROM data WHERE userid = ${player}`);
        result.ress = await client.connection.query(`SELECT * FROM ress WHERE userid = ${player}`);
        result.items = await client.connection.query(`SELECT * FROM items WHERE userid = ${player}`);
        result.enchant = await client.connection.query(`SELECT * FROM enchant WHERE userid = ${player}`);
        result.prospect = await client.connection.query(`SELECT * FROM prospect WHERE userid = ${player}`);
        result.slots = await client.connection.query(`SELECT * FROM slots WHERE userid = ${player}`);
        result.stats = await client.connection.query(`SELECT * FROM stats WHERE userid = ${player}`);
        return result;
    },

    /**
     * @param {number} num The wanted number to be crunched
     * @example nFormatter(40000) > '40k'
     * @returns A formatted typology of a number
     */
     nFormatter: function(num) {
        const format = [
            { value: 1e18, symbol: 'E' },
            { value: 1e15, symbol: 'P' },
            { value: 1e12, symbol: 'T' },
            { value: 1e9, symbol: 'G' },
            { value: 1e6, symbol: 'M' },
            { value: 1e3, symbol: 'k' },
            { value: 1, symbol: '' },
        ];
        const formatIndex = format.findIndex((data) => num >= data.value);
        return (num / format[formatIndex === -1? 6: formatIndex].value).toFixed() + format[formatIndex === -1?6: formatIndex].symbol;
    },

    /**
     * @param {timestamp} date The timestamp to convert
     * @example checkDays(1589788800) > '1 day ago'
     * @returns The number of day based on a Timestamp
     */
    checkDays: function(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    },

    /**
     * @param {member} member Reminder : "member" is an user from a guild, not the user outside the server
     * @returns complete date since member boosting
     * @example
     * const booster = interaction.guild.members.cache.get(interaction.user.id);
     * const boostDate = getPremiumDuration(booster);
     * boostDate.years, boostDate.months etc..
     */
    getPremiumDuration: function (member) {
        const duration = Date.now() - member.premiumSinceTimestamp
      
        const seconds = Math.floor(duration / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)

        return {
            years,
            months: months % 12,
            days: days % 30,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60
        }
    },

    /**
     * @param {string} lang The desired language to be translated
     * @param {string} path to the JSON string
     * @param {string} args to replace in the string
     * @example translate(player.data.lang, 'bal.actualBal', `**${nFormatter(player.data.money)}**💰`)
     * @returns the translated string
     */
    translate: function(lang, path, ...args) {
        const langFile = require('../utils/Text/' + lang + '.json');
        path = path.split('.').reduce((o,i) => o[i], langFile);
        return format(path, ...args);
    },

    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * @param {interaction} interaction The discord interaction message
     * @param {array} pages The array who contains the embeds
     * @returns The embed which contain the paginator (or without any components if there's only one page)
     */
    buttonPages: async function(interaction, pages, time = 60000) {
        // errors
        if (!interaction) throw new Error("Please provide an interaction argument.");
        if (!pages) throw new Error("Please provide a page argument.");
        if (!Array.isArray(pages)) throw new Error("Pages must be an array");

        if (typeof time !== "number") throw new Error("Time must be a number.");
        if (parseInt(time) < 30000)
            throw new Error("Time must be greater than 30 Seconds.");

        // defer reply
        await interaction.deferReply();

        // no buttons if there is only one page
        if (pages.length === 1) {
            const page = await interaction.editReply({
                embeds: pages,
                components: [],
                fetchReply: true
            });

            return page;
        }

        // adding buttons
        const prev = new ButtonBuilder()
            .setCustomId("prev")
            .setEmoji("⬅")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);
        
        const home = new ButtonBuilder()
            .setCustomId("home")
            .setEmoji("🏠")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        
        const next = new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("➡")
            .setStyle(ButtonStyle.Primary);

        const buttonRow = new ActionRowBuilder().addComponents(prev, home, next);
        let index = 0;

        const currentPage = await interaction.editReply({
            embeds: [pages[index]],
            components: [buttonRow],
            fetchReply: true
        });

        // creating the collector
        const collector = await currentPage.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
            time
        });

        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id)
                return i.reply({
                    content: "You can't use these buttons",
                    ephemeral: true
                });

            await i.deferUpdate();

            switch (i.customId) {
                case "prev":
                    if (index > 0) index--;
                    break;
            
                case "home":
                    index = 0;
                    break;
                
                case "next":
                    if (index < pages.length - 1) index++;
                    break;
            }

            if (index === 0) prev.setDisabled(true);
            else prev.setDisabled(false);

            if (index === 0) home.setDisabled(true);
            else home.setDisabled(false);

            if (index === pages.length - 1) next.setDisabled(true);
            else next.setDisabled(false);

            await currentPage.edit({
                embeds: [pages[index]],
                components: [buttonRow]
            });

            collector.resetTimer();
        });

        // ending the collector
        collector.on("end", async (i) => {
            await currentPage.edit({
                embeds: [pages[index]],
                components: []
            });
        });
        return currentPage;
    }
})