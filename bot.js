const fs = require("fs");
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.sendStatus(200);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);

server.listen(process.env.PORT, () => {
  console.log('Listening');
});

const Discord = require('discord.js');
const client = new Discord.Client({
  presence: { activity: { name: "people vote for Suggester! - v!help", type: "WATCHING" }, status: "online" }
});

const Enmap = require('enmap')
if (!client.stats) {
client.stats = new Enmap({
          name: "stats"
        });
}

const defaults = {
    total: 0,
    user: "",
    topgg: [0, [], false],
    botlistspace: [0, [], false],
    bfd: [0, [], false],
    dbl: [0, [], false],
    dboats: [0, [], false],
    gbl: [0, [], false],
    bod: false
};

function makeDefault (current, id) {
  let obj = defaults;
  if (current.topgg) {
    obj = current;
    obj.user = id;
  } else {
    obj.total = current.votes;
    obj.user = id;
  }
  
  return obj;
};

async function handleVote (user, type, valueToAdd, client, timeforday) {
    await client.stats.defer;
  
    let timeforstreak = timeforday*5;

    client.stats.ensure(user, defaults)
    let stats = client.stats.get(user);
    if (stats.id || stats.votes || !stats.user) stats = makeDefault(stats, user);
    stats[type][0]+=valueToAdd;
    stats[type][1].push(Date.now());
    stats.total+=valueToAdd;
    stats[type][2] = false;
    let last5 = stats[type][1].filter(time => Date.now()-time<=timeforstreak)
    let emotes = ["<:streak1:690376809761734706>", "<:streak2:690377235978256384>", "<:streak3:690377163827970049>", "<:streak4:690377107817103380>", "<:streak5:690377450877747221>"];
    if (last5.length >= 5 && last5.filter(time => Date.now()-time>timeforday && Date.now()-time<timeforday*2)) {
      stats[type][1] = [Date.now()];
      stats[type][0]++;
      client.stats.set(user, stats);
      return `\n> Streak ${emotes[4]} | +1 Extra Vote Applied for Completed Streak! :tada:`;
    } else if (last5.length > 0 && last5.filter(time => Date.now()-time>timeforday && Date.now()-time<timeforday*2)) {
      client.stats.set(user, stats);
      return `\n> Streak ${emotes[last5.length-1]}`;
    } else {
      client.stats.set(user, stats);
      return null;
    }
  }


async function fetchUser (id, client) {
  function fetchUnknownUser(uid) {
			return client.users.fetch(uid, true)
				.then(() => {
					return client.users.cache.get(uid);
				})
				.catch(() => {
					return null;
				});
		}

		return client.users.cache.get(id)
			|| fetchUnknownUser(id)
			|| null;
}


app.post('/topgg', async (req, res) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.TOPGG_PWD) return res.sendStatus(403);
  let voteResponse = await handleVote(req.body.user, "topgg", req.body.isWeekend ? 2 : 1, client, 43200000);
  let hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
  let user = await fetchUser(req.body.user, client);
  if (!user) return res.sendStatus(200);;
  let embed = new Discord.MessageEmbed()
    .setDescription(`${user.tag} (\`${user.id}\`) voted for Suggester on [top.gg](https://top.gg/bot/564426594144354315/vote)!\n> ${req.body.isWeekend ? "+2 Votes (Weekend Bonus)" : "+1 Vote"}${voteResponse ? voteResponse : ""}`)
    .setFooter("Thanks for voting!")
    .setColor("#4663ec");
  hook.send({embeds: [embed], avatarURL: "https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2Fa_eadf00405ab375668c76da10ee95f646.png?v=1584652104384"});
  return res.sendStatus(200);
});

app.post('/botlistspace', async (req, res) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.BLS_PWD) return res.sendStatus(403);
  let voteResponse = await handleVote(req.body.user.id, "botlistspace", 1, client, 86400000);
  let hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
  let user = await fetchUser(req.body.user.id, client);
  if (!user) return res.sendStatus(200);
  let embed = new Discord.MessageEmbed()
    .setDescription(`${user.tag} (\`${user.id}\`) voted for Suggester on [botlist.space](https://botlist.space/bot/564426594144354315/upvote)!\n> +1 Vote${voteResponse ? voteResponse : ""}`)
    .setFooter("Thanks for voting!")
    .setColor("#4663ec");
  hook.send({embeds: [embed], avatarURL: "https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2F70ec291cf1dcaa33f8c50d5b3333a521.png?v=1584671121819"});
  return res.sendStatus(200);
});

app.post('/bfd', async (req, res) => {
  console.log("aa")
  if (!req.headers.authorization || req.headers.authorization !== process.env.BFD_PWD) return res.sendStatus(403);
  let voteResponse = await handleVote(req.body.user, "bfd", 1, client, 86400000);
  let hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
  let user = await fetchUser(req.body.user, client);
  if (!user) return res.sendStatus(200);
  let embed = new Discord.MessageEmbed()
    .setDescription(`${user.tag} (\`${user.id}\`) voted for Suggester on [Bots for Discord](https://botsfordiscord.com/bot/564426594144354315/vote)!\n> +1 Vote${voteResponse ? voteResponse : ""}`)
    .setFooter("Thanks for voting!")
    .setColor("#4663ec");
  hook.send({embeds: [embed], avatarURL: "https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2Fe1e1eb9ed8c0c3c67dd62e282bc5a704.png?v=1584714973147"});
  return res.sendStatus(200);
});

app.post('/dbl', async (req, res) => {
  if (!req.headers["x-dbl-signature"] || req.headers["x-dbl-signature"].split(" ")[0] !== process.env.DBL_PWD) return res.sendStatus(403); 
  let voteResponse = await handleVote(req.body.id, "dbl", 1, client, 86400000);
  let hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
  let user = await fetchUser(req.body.id, client);
  if (!user) return res.sendStatus(200);
  let embed = new Discord.MessageEmbed()
    .setDescription(`${user.tag} (\`${user.id}\`) voted for Suggester on [Discord Bot List](https://discordbotlist.com/bots/564426594144354315/upvote)!\n> +1 Vote${voteResponse ? voteResponse : ""}`)
    .setFooter("Thanks for voting!")
    .setColor("#4663ec");
  hook.send({embeds: [embed], avatarURL: "https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2F278624a3684793369f3055ba26f7292e.png?v=1584717271727"});
  return res.sendStatus(200);
});

app.post('/dboats', async (req, res) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.DBOATS_PWD) return res.sendStatus(403);
  let voteResponse = await handleVote(req.body.user.id, "dboats", 1, client, 43200000);
  let hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
  let user = await fetchUser(req.body.user.id, client);
  if (!user) return res.sendStatus(200);
  let embed = new Discord.MessageEmbed()
    .setDescription(`${user.tag} (\`${user.id}\`) voted for Suggester on [Discord Boats](https://discord.boats/bot/564426594144354315/vote)!\n> +1 Vote${voteResponse ? voteResponse : ""}`)
    .setFooter("Thanks for voting!")
    .setColor("#4663ec");
  hook.send({embeds: [embed], avatarURL: "https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2Fa_50718fbcb8030a76b775540db66bd0b8.png?v=1584717712520"});
  return res.sendStatus(200);
});

app.post('/gbl', async (req, res) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.GBL_PWD) return res.sendStatus(403);
  console.log("GBL " + req.body.id);
  let voteResponse = await handleVote(req.body.id, "gbl", 1, client, 43200000);
  let hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
  let user = await fetchUser(req.body.id, client);
  if (!user) return res.sendStatus(200);
  let embed = new Discord.MessageEmbed()
    .setDescription(`${user.tag} (\`${user.id}\`) voted for Suggester on [Glenn Bot List](https://glennbotlist.xyz/bot/suggester/vote)!\n> +1 Vote${voteResponse ? voteResponse : ""}`)
    .setFooter("Thanks for voting!")
    .setColor("#4663ec");
  hook.send({embeds: [embed], avatarURL: "https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2Fa_361d2318b5a519ab805c9ca089ddb56c.png?v=1584718647042"});
  return res.sendStatus(200);
});

client.login(process.env.TOKEN)
fs.readdir("./events/", (err, files) => {
	files.forEach(file => {
		const eventHandler = require(`./events/${file}`);
		const eventName = file.split(".")[0];

		client.on(eventName, (...args) => {
			try {
				eventHandler(Discord, client, ...args);
			} catch (err) {
				console.log(err);
			}

		});
	});
});
