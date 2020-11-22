import {Client} from 'discord.js';
import {initDb} from '../util/db';

export default class {
  name = 'ready';

  async run(client: Client) {
    console.log('Logged in as', client.user?.tag);

    initDb()
      .then(() => console.log('Connected to MongoDB'))
      .catch(console.error);
  }
}
