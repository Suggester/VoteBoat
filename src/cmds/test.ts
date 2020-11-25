import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import {User} from '../util/db';
import {UserDocInstance} from '@types';
import {inspect} from 'util';

export default class extends Cmd {
  name = 'test';
  perms = 10;

  constructor() {
    super();
  }

  async run(_client: Client, msg: Message): Promise<void> {
    const found: UserDocInstance | null = (await User.findOne({
      id: msg.author.id,
    })) as UserDocInstance | null;
    const total = found?.lifetimeTotal();

    msg.channel.send(`Total: ${total}`);
    msg.channel.send(inspect(found), {code: 'js'});
  }
}
