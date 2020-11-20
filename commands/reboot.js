module.exports = {
  controls: {
    permission: 0,
    usage: 'reboots',
    description: 'Reboots the bot'
  },
  do: async (message, client, args, Discord) => {
    await message.channel.send('Rebooting...')
    process.exit()
  }
}
