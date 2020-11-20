module.exports = {
  controls: {
    permission: 0,
    usage: 'eval <code>',
    description: 'Runs code'
  },
  do: async (message, client, args, Discord) => {
    const clean = (text) => {
      if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      } else {
        return text
      }
    }
    const code = args.join(' ')

    try {
      let evaled = eval(code) // eslint-disable-line no-eval

      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled)
      }

      if (args.splice(-1)[0] !== '//silent') {
        if (evaled.includes(process.env.TOKEN)) {
          return message.channel.send(':rotating_light: `CENSORED: TOKEN` :rotating_light:')
        } else {
          message.channel.send(clean(evaled), { code: 'xl' })
        }
      }
    } catch (err) {
      if (args.splice(-1)[0] !== '//silent') {
        if (err.toString().includes(process.env.TOKEN)) {
          return message.channel.send(':rotating_light: `CENSORED: TOKEN` :rotating_light:')
        } else {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
        }
      }
    }
  }
}
