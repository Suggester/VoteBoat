import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import {Embed} from '../util/structures/embed';
import {inspect} from 'util';

// bring some useful stuff into scope
// so they can be used with eval without require
import {User} from '../util/db';

export default class extends Cmd {
  name = 'eval';
  perms = 10;

  constructor() {
    super();
  }

  sendEmbed(
    msg: Message,
    text: string,
    isError = false
  ): Promise<Message | Message[]> {
    return new Embed(msg.client)
      .setDescription('```js\n' + text + '```')
      .setColor(isError ? 'RED' : 'GREEN')
      .setTimestamp()
      .send(msg.channel.id);
  }

  async run(_client: Client, msg: Message): Promise<void> {
    // const {User} = await import('../util/db');

    [User, Embed]; // this is to get rid of eslint errors lol

    const code = msg.args?.join(' ');

    if (!code) {
      msg.channel.send(':x: You must provide code to execute.');
      return;
    }

    try {
      const evald = await eval(code); // eslint-disable-line no-eval
      const out = typeof evald === 'string' ? evald : inspect(evald);

      this.sendEmbed(msg, out.substring(0, 2000));
    } catch (err) {
      this.sendEmbed(msg, inspect(err).substring(0, 2000), true);
    }
  }
}
