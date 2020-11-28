import {Client} from 'discord.js';
import {initDb, User} from '../util/db';
import {listInfo} from '../util/util';
import {Embed} from '../util/structures/embed';
import {UserDoc, BotList, ValueOf} from '@types';

export default class {
  name = 'ready';

  async run(client: Client) {
    console.log('Logged in as', client.user?.tag);

    await initDb()
      .then(() => console.log('Connected to MongoDB'))
      .catch(console.error);

    setInterval(() => this.checkReminder(client), 60_000);
    this.checkReminder(client);
  }

  async sendReminder(client: Client, uid: string, list: BotList) {
    const l = listInfo.get(list);

    if (!l) {
      return;
    }

    new Embed(client)
      .setDescription(
        `Keep your streak alive! It's time to vote for Suggester again on [${l.name}](${l.url})`
      )
      .sendDM(uid);
  }

  async checkReminder(client: Client) {
    const ignoreLists = ['bod'];
    const lists12h = ['topgg', 'dboats', 'gbl'];
    const lists24h = ['botlistspace', 'bfd', 'dbl'];

    const allUsers: UserDoc[] = (await User.find({notify: true})) as UserDoc[];

    for (const user of allUsers) {
      const lists: [string, ValueOf<UserDoc['lists']>][] = Object.entries(
        user.toObject().lists
      );

      for (const [name, data] of lists) {
        if (ignoreLists.includes(name) || data.sentReminder) {
          continue;
        }

        const last = data.votes[data.votes.length - 1];

        if (!last) {
          continue;
        }

        if (lists12h.includes(name)) {
          if (last + 43_200_000 >= Date.now()) {
            continue;
          }

          // ignoring the promise rejection cus itll reject if someone has dms off
          // and theres no way to handle that and i dont wanna flood the console
          this.sendReminder(client, user.id, name as BotList).catch(() => {});

          user.lists[name as BotList].sentReminder = true;

          user.save();
        }

        if (lists24h.includes(name)) {
          if (last + 86_400_000 >= Date.now()) {
            continue;
          }

          this.sendReminder(client, user.id, name as BotList).catch(() => {});

          user.lists[name as BotList].sentReminder = true;

          user.save();
        }
      }
    }
  }
}
