const lists = require("../lists.json");

async function fetchUser (id, client) {
  if (!id) return null;
	let foundId;
	let matches = id.match(/^<@!?(\d+)>$/);
	if (!matches) foundId = id;
	else foundId = matches[1];
  
  function fetchUnknownUser(uid) {
			return client.users.fetch(uid, true)
				.then(() => {
					return client.users.cache.get(uid);
				})
				.catch(() => {
					return null;
				});
		}

		return client.users.cache.get(foundId)
			|| fetchUnknownUser(foundId)
			|| null;
}

const translate = {
  "topgg": "top.gg",
  "dbl": "Discord Bot List",
  "botlistspace": "botlist.space",
  "bfd": "Bots for Discord",
  "dboats": "Discord Boats",
  "divine": "Divine Discord Bot List",
  "gbl": "Glenn Bot List"
}

module.exports = {
	controls: {
		permission: 10,
		aliases: ["votes"],
		usage: "stats (user)",
		description: "Shows voting stats"
	},
	do: async (message, client, args, Discord) => {
    let user = await fetchUser(args[0], client) || message.author;
    let stats = client.stats.get(user.id);
    console.log(stats)
    if (!stats) return message.channel.send(`${user.id === message.author.id ? "You don't" : "This user doesn't"} have any voting stats! ${user.id === message.author.id ? "Get voting!" : ""}`)
    if (!stats.total) return message.channel.send("Err... looks like something is wrong with your vote total. Try voting on any bot list site and retry this command.")
    let embed = new Discord.MessageEmbed()
      .setAuthor(message.member.displayName, message.author.displayAvatarURL({format: "png", dynamic :true}))
      .setColor(message.member.displayHexColor)
      .addField("Total Votes", `${stats.total} Votes`);
    Object.keys(stats).forEach(key => {
      if (key !== "bod" && key !== "total" && key !== "user") {
        embed.addField(translate[key], `${stats[key][0]} Votes`, true)
      }
    })
    embed.addField("Reviewed on Bots on Discord?", stats.bod ? "Yes": "No")
    message.channel.send(embed)
  }
};