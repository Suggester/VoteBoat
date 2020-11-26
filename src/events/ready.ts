import {Client} from 'discord.js';
import {initDb, User} from '../util/db';
import {Embed} from '../util/structures/embed';

export default class {
  name = 'ready';

  async run(client: Client) {
    console.log('Logged in as', client.user?.tag);

    await initDb()
      .then(() => console.log('Connected to MongoDB'))
      .catch(console.error);

    setInterval(() => this.checkReminder(client), 60_000);
  }

  async sendReminder(client: Client, uid: string) {

  }

  async checkReminder(client: Client) {
    const allUsers = await User.find({notify: true});

    for (const user in allUsers) {
      // check if its been 12 or 24 hours
      // this.sendReminder(client, user.id);
    }
  }
}
