// const lists = require('../lists.json')

async function fetchUser (id, client) {
  if (!id) return null
  let foundId
  const matches = id.match(/^<@!?(\d+)>$/)
  if (!matches) foundId = id
  else foundId = matches[1]

  function fetchUnknownUser (uid) {
    return client.users.fetch(uid, true)
      .then(() => {
        return client.users.cache.get(uid)
      })
      .catch(() => {
        return null
      })
  }

  return client.users.cache.get(foundId) ||
    fetchUnknownUser(foundId) ||
    null
}

const translate = {
  topgg: 'top.gg',
  dbl: 'Discord Bot List',
  botlistspace: 'botlist.space',
  bfd: 'Bots for Discord',
  dboats: 'Discord Boats',
  gbl: 'Glenn Bot List',
  arcane: 'Arcane Center'
}

module.exports = {
  controls: {
    permission: 10,
    aliases: ['votes'],
    usage: 'stats (user)',
    description: 'Shows voting stats'
  },
  do: async (message, client, args, Discord) => {
    const user = await fetchUser(args[0], client) || message.author
    if (!user) return message.channel.send(':x: User Not Found!')
    const member = message.guild.members.cache.get(user.id)
    if (!member) return message.channel.send(':x: Member Not Found!')
    const stats = client.stats.get(user.id)
    if (!stats) return message.channel.send(`${user.id === message.author.id ? "You don't" : "This user doesn't"} have any voting stats! ${user.id === message.author.id ? 'Get voting!' : ''}`)
    if (!stats.total) return message.channel.send('Err... looks like something is wrong with your vote total. Try voting on any bot list site and retry this command.')
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${member.displayName}'s Voting Stats!`, user.displayAvatarURL({ format: 'png', dynamic: true }))
      .setColor(member.displayHexColor)
      .addField('Total Votes', `${stats.total} Votes`)
    Object.keys(stats).forEach(key => {
      if (key !== 'bod' && key !== 'gblrate' && key !== 'total' && key !== 'user' && key !== 'votes' && key !== 'divine') {
        let cooldown = false
        const last = stats[key][1][stats[key][1].length - 1]
        switch (key) {
          case 'topgg':
          case 'dboats':
          case 'arcane':
          case 'gbl': {
            // 12h
            if (last + 43200000 > Date.now()) cooldown = true
            break
          }
          case 'botlistspace':
          case 'bfd':
          case 'divine':
          case 'dbl': {
            if (last + 86400000 > Date.now()) cooldown = true
            break
          }
        }
        embed.addField(`${translate[key]} ${cooldown ? '🕑' : ''}`, `${stats[key][0]} Votes`, true)
      }
    })
    embed.addField('Reviewed on Bots on Discord?', stats.bod ? 'Yes' : 'No')
    embed.addField('Rated on Glenn Bot List?', stats.gblrate ? 'Yes' : 'No')
    message.channel.send(embed)
  }
}
