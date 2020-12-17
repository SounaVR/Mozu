//const pingL = require('../../utils/pingL.js');

exports.run = async (client, message) => {

  function formatNumber(number) {
    return Number.parseFloat(number).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  const m = await message.channel.send("Ping ?");
  const ping = Math.round(m.createdTimestamp - message.createdTimestamp);
  m.edit(`
    P${'o'.repeat(Math.min(Math.round(ping / 100), 1500))}ng! <:chatPute:764891421290659900>\nLatence ► ${ping}ms.\nAPI Discord ► ${Math.round(client.ws.ping)}ms.`);

  // const m = await message.channel.send("Ping ?");
  // var ping = new pingL('162.159.136.232');

  // ping.start(function(err, ms) {
  //   if (err) throw err;
  //   m.edit(`
  //   P${'o'.repeat(Math.min(Math.round(ms)))}ng! <:chatPute:764891421290659900>\nLatence ► ${ms}ms.\nAPI Discord ► ${Math.round(client.ws.ping)}ms.`);
  // });
}
  
module.exports.help = {
    name: "ping",
    description_fr: "Affiche la latence du bot",
    description_en: "Displays bot latency",
    category: "Infos",
    aliases: ["pong"]
};