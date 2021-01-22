module.exports = {
    getUser: async function(con, user) {
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM data WHERE userid = ${user}`, function(err, data) {
              if (!data[0]) return resolve(false)
              resolve({data:data[0]})
            })
          })
    },

    getPlayer: async function(con, player) {
        return new Promise(function(resolve, reject) {
          con.query(`SELECT * FROM data WHERE userid = ${player}`, function(err, data) {
            if (!data[0]) return resolve(false)
              resolve({data:data[0]})
          })
        })
    },

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

    getUserFromMention: function(client, mention) {
      if (!mention) return;

      if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
          mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
      }
    }
}
