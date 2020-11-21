import {Cmd} from './command';
import {Client, Message} from 'discord.js';

export default class extends Cmd {
  name = 'ping';
  aliases = ['pong', 'hi'];

  constructor() {
    super();
  }

  async run(client: Client, msg: Message): Promise<void> {
    const before = Date.now();
    const m = await msg.channel.send(':ping_pong: Pong!');
    const after = Date.now();

    await m.edit(
      `:ping_pong: Message sent in \`${
        after - before
      }\`ms.\n:heartbeat: Websocket Latency: \`${client.ws.ping.toFixed()}\`ms.`
    );
  }
}
