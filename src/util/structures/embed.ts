import {
  ChannelResolvable,
  Client,
  Message,
  MessageEmbed,
  MessageOptions,
  Snowflake,
  UserResolvable,
} from 'discord.js';
import fetch from 'node-fetch';

export class Embed extends MessageEmbed {
  constructor(public client: Client) {
    super();
  }

  static from(client: Client, embed: MessageEmbed): Embed {
    const e = new Embed(client);

    Object.assign(embed, e);

    return e;
  }

  async send(
    channel: ChannelResolvable,
    options: MessageOptions = {}
  ): Promise<Message | Message[]> {
    const c = this.client.channels.resolve(channel);

    if (!c) {
      throw new Error('Cannot send message to non-existant channel.');
    }

    if (!c.isText()) {
      throw new Error('Cannot send message to non-text-based channel');
    }

    return c.send({...{embed: this}, ...options});
  }

  async sendWebhook(id: Snowflake, token: string) {
    return await fetch(
      `https://discord.com/api/webhooks/${id}/${token}?wait=1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({embeds: [this.toJSON()]}),
      }
    ).then(r => r.json());
  }

  async sendDM(
    user: UserResolvable,
    options: MessageOptions = {}
  ): Promise<Message | Message[]> {
    const u =
      this.client.users.resolve(user) ||
      (await this.client.users.fetch(user.valueOf()));

    if (!u) {
      throw new Error('This user does not exist.');
    }

    return u.send({...{embed: this}, ...options});
  }
}
