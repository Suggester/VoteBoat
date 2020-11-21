import {Client} from 'discord.js';

export default class {
  name = 'ready';

  constructor() {}

  async run(client: Client) {
    console.log('Logged in as', client.user?.tag);
  }
}
