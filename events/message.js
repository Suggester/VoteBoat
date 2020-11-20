const fs = require('fs')
module.exports = async (Discord, client, message) => {
  if (message.channel.type !== 'text') return
  if (message.author.bot === true) return

  const prefix = 'v!'

  const possiblementions = [`<@${client.user.id}> help`, `<@${client.user.id}>help`, `<@!${client.user.id}> help`, `<@!${client.user.id}>help`, `<@${client.user.id}> prefix`, `<@${client.user.id}>prefix`, `<@!${client.user.id}> prefix`, `<@!${client.user.id}>prefix`, `<@${client.user.id}> ping`, `<@${client.user.id}>ping`, `<@!${client.user.id}> ping`, `<@!${client.user.id}>ping`]
  if (possiblementions.includes(message.content.toLowerCase())) return message.reply('Hi there! My prefix is **v!**')

  if (!message.content.toLowerCase().startsWith(prefix)) return
  // Only commands after this point
  // Check if message is a command
  const args = message.content.split(' ').splice(1)

  const commandText = message.content.split(' ')[0].toLowerCase().split(prefix)[1] // Input command
  const devs = ['327887845270487041']
  const permission = devs.includes(message.author.id) ? 0 : 10

  fs.readdir('./commands/', (e, files) => {
    if (e) {
      console.log(e)
    }

    files.forEach(file => {
      const commandName = file.split('.')[0] // Command to check against
      const command = require('../commands/' + commandName) // Command file

      if (commandText === commandName || (command.controls.aliases && command.controls.aliases.includes(commandText))) { // Check if command matches
        if (permission > command.controls.permission) return message.react('🚫')

        try {
          return command.do(message, client, args, Discord)
        } catch (err) {
          message.channel.send(':x: Something went wrong with that command, please try again later.')
          console.log(err)
        };
      }
    })
  })
}
