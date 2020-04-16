module.exports = {
	controls: {
		permission: 10,
		usage: "checkrate",
    aliases: ["checkrating"],
		description: "Checks if you've rated on Glenn Bot List, and if you have applies 2 extra votes!"
	},
	do: async (message, client, args, Discord) => {
    const axios = require('axios')
    if (!client.stats.get(message.author.id)) return message.channel.send(":x: You don't have a database entry yet, go vote and run this command again!")
    if (client.stats.get(message.author.id, "gblrate")) return message.channel.send(":x: You have already redeemed your votes from submitting a rating!")
    axios.get(`https://glennbotlist.xyz/api/v2/bot/564426594144354315`).then(resp => {
      if (resp.data.rates.find(r => r.id === message.author.id)) {
        client.stats.math(message.author.id, "+", 2, "total")
        client.stats.set(message.author.id, true, "gblrate")
        let hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        let embed = new Discord.MessageEmbed()
          .setDescription(`${message.author.tag} (\`${message.author.id}\`) submitted a rating on [Glenn Bot List](https://glennbotlist.xyz/bot/564426594144354315)!\n> +2 Votes`)
          .setFooter("Thanks for reviewing!")
          .setColor("#4663ec");
        hook.send({embeds: [embed], avatarURL: "https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2Fa_361d2318b5a519ab805c9ca089ddb56c.png?v=1584718647042"})
        return message.channel.send("You have been given your 2 votes, thanks for rating!");
      } else return message.channel.send(":x: You have not submitted a rating on Glenn Bot List, please do so before running this command!\nLink: https://glennbotlist.xyz/bot/564426594144354315")
    }).catch(err => {
      console.log(err)
      return message.channel.send("There was an error contacting Glenn Bot List!");
    })
  }
};