module.exports = {
  controls: {
    permission: 10,
    aliases: ['review', 'reviewcheck'],
    usage: 'checkreview',
    description: "Checks if you've reviewed on Bots on Discord, and if you have applies 3 extra votes!"
  },
  do: async (message, client, args, Discord) => {
    const axios = require('axios')
    if (!client.stats.get(message.author.id)) return message.channel.send(":x: You don't have a database entry yet, go vote and run this command again!")
    if (client.stats.get(message.author.id, 'bod')) return message.channel.send(':x: You have already redeemed your votes from submitting a review!')
    axios.get(`https://bots.ondiscord.xyz/bot-api/bots/564426594144354315/review?owner=${message.author.id}`, { headers: { Authorization: process.env.BOD_AUTH } }).then(resp => {
      if (resp.data.exists) {
        client.stats.math(message.author.id, '+', 3, 'total')
        client.stats.set(message.author.id, true, 'bod')
        const hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
        const embed = new Discord.MessageEmbed()
          .setDescription(`${message.author.tag} (\`${message.author.id}\`) submitted a review on [Bots on Discord](https://bots.ondiscord.xyz/bots/564426594144354315/review)!\n> +3 Votes`)
          .setFooter('Thanks for reviewing!')
          .setColor('#4663ec')
        hook.send({ embeds: [embed], avatarURL: 'https://cdn.glitch.com/e10a63e8-6b5d-4d37-a694-5dfd1332828c%2Fc9599b1e0fdb902b81d93468ada512cf.png?v=1584740333600' })
        return message.channel.send('You have been given your 3 votes, thanks for reviewing!')
      } else return message.channel.send(':x: You have not submitted a review on Bots on Discord, please do so before running this command!\nLink: https://bots.ondiscord.xyz/bots/564426594144354315/review')
    }).catch(err => {
      console.log(err)
      return message.channel.send('There was an error contacting Bots on Discord!')
    })
  }
}
