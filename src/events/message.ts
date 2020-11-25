import {Client, Message} from 'discord.js';

export default class MessageEvent {
  name = 'message';

  async run(client: Client, msg: Message) {
    if (
      msg.author.bot ||
      !msg.content.startsWith(global.config.prefix) ||
      msg.channel.type !== 'text' ||
      global.config?.whitelisted_guilds.includes(msg.guild?.id || '')
    ) {
      return;
    }

    const args = msg.content.split(/\s+/);
    const command = args
      .shift()
      ?.slice(global.config.prefix.length)
      .trim()
      .toLowerCase();

    msg.command = command;
    msg.args = args;

    if (!command) {
      return;
    }

    const cmd = client.cmds.find(
      c => !!(c.name === command || c?.aliases?.includes(command))
    );

    if (!cmd) {
      return;
    }

    if (!cmd.checkPerms(msg)) {
      msg.channel.send(':x: You do not have permission to use that command.');
      return;
    }

    cmd.run(client, msg).catch(console.error);
  }
}
