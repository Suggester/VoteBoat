const lists = require('../lists.json')
module.exports = {
  controls: {
    permission: 10,
    aliases: ['command', 'howto'],
    usage: 'help',
    description: 'Shows help information'
  },
  do: async (message, client, args, Discord) => {
    const embed = new Discord.MessageEmbed()
      .setTitle('Voting Information')
      .setDescription('Voting on various bot lists sites really helps support Suggester, so as thanks we allow you to purchase various roles in the server with the votes you accumulate!')
      .addField('How Voting Works', 'We provide links (see below) that you can use to vote for the bot. When you vote, it gets logged in <#571073203900776448> and internally on VoteBoat.\nEach vote is 1 more for your total, except in these scenarios:\n> - You vote on top.gg on Friday, Saturday, or Sunday (GMT) `+2 Votes`\n> - You vote 5 times in a row (keep a streak) on __any__ bot list site `+1 Extra Vote per 5 Day Streak`\n> - You leave a review on [Bots on Discord](https://bots.ondiscord.xyz/bots/564426594144354315/review), then use the **v!checkreview** command `+3 Votes`')
      .addField('Where to Vote', `You can vote on all of the following sites:\n**[top.gg](${lists.topgg})** (Once every 12 hours)\n**[botlist.space](${lists.botlistspace})** (Once every 24 hours)\n**[Bots for Discord](${lists.bfd})** (Once every day, resets at midnight UTC)\n**[Discord Bot List](${lists.dbl})** (Once every 24 hours)\n**[Discord Boats](${lists.dboats})** (Once every 12 hours)`)
      .addField('Rewards!', 'Use the **v!buy** command to see a list of all rewards we offer for voting, and use **v!stats** to check your vote count!')
      .setColor('#5334eb')
    message.channel.send(embed)
  }
}
