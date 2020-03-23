module.exports = async (Discord, client) => {
  const lists = require("../lists.json")
	console.log(`Logged in as ${client.user.tag}!`);
  
  setInterval(function() {
    console.log("INTERVAL")
    client.stats.filter(s => s.total).forEach(stat => {
      Object.keys(stat).forEach(key => {
        if (key !== "bod" && key !== "total" && key !== "user") {
          if (!stat[key][2]) {
            let last = stat[key][1][stat[key][1].length-1];
            switch (key) {
              case "topgg":
              case "dboats":
              case "gbl": {
                //12h
                if (last+216000000<Date.now()) {
                  if (stat.user && client.users.cache.get(stat.user)) {
                    client.users.cache.get(stat.user).send(`Keep your streak alive! It's time to vote for Suggester again at ${lists[key]}`).catch(() => {})
                  }
                  stat[key][2] = true;
                }
                break;
              }
              case "botlistspace":
              case "bfd":
              case "divine": {
                if (last+432000000<Date.now()) {
                  if (stat.user && client.users.cache.get(stat.user)) {
                    client.users.cache.get(stat.user).send(`Keep your streak alive! It's time to vote for Suggester again at ${lists[key]}`).catch(() => {})
                  }
                  stat[key][2] = true;
                }
                break;
              }
            }
          }
        }
      })
      if (stat.user) client.stats.set(stat.user, stat)
    })
  }, 30000)
}