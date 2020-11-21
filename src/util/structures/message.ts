/* placeholder for now */
import {
  Structures,
  Client,
  TextChannel,
  NewsChannel,
  DMChannel,
} from 'discord.js';

Structures.extend('Message', M => {
  return class extends M {
    constructor(
      client: Client,
      data: object,
      channel: TextChannel | NewsChannel | DMChannel
    ) {
      super(client, data, channel);
    }
  };
});
