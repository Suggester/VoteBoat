import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import {UserDoc} from '@types';

export default class extends Cmd {
  name = 'notify';
  aliases = ['remind', 'reminders'];
  perms = 10;

  help = {
    desc: 'Enable or disable voting reminders',
    usage: '<enabled|disabled>',
  };

  constructor() {
    super();
  }

  async run(_client: Client, msg: Message): Promise<void> {
    const db: UserDoc = await msg.author.db();
    const action = msg?.args?.shift()?.toLowerCase() || '';
    const {x, check} = global.config.emojis;

    const yes = ['yes', 'on', 'true', 'enabled', 'enable'];
    const no = ['no', 'off', 'false', 'disabled', 'disable'];

    if (yes.includes(action)) {
      db.notify = true;
      db.save().catch(console.error);

      msg.channel.send(`${check} **Enabled** voting reminders.`);

      return;
    }

    if (no.includes(action)) {
      db.notify = false;
      db.save().catch(console.error);

      msg.channel.send(`${x} **Disabled** voting reminders.`);

      return;
    }

    msg.channel.send(
      db.notify
        ? `${check} Your notifications are currently **enabled**.`
        : `${x} Your notifications are currently **disabled**.`
    );
  }
}
