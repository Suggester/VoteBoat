import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import fetch from 'node-fetch';

export default class extends Cmd {
  name = 'checkvote';
  aliases = ['checkreview'];

  constructor() {
    super();
  }

  async run(_client: Client, msg: Message): Promise<void> {
    const db = await msg.author.db();
    const {x, check} = global.config.emojis;

    if (db.toObject().lists.bod.votes.length) {
      msg.channel.send(`${check} Your review has already been counted!`);
      return;
    }

    const res = await fetch(
      `https://bots.ondiscord.xyz/bot-api/bots/${global.config.bot_id}/review?owner=${msg.author.id}`,
      {
        headers: {
          Authorization: global.config.bot_lists.bod.key,
        },
      }
    ).catch(console.error);

    if (!res) {
      msg.channel.send(`${x} An error occurred. Please try again.`);
      return;
    }

    const json: {exists: boolean} = await res.json();
    console.log(json);

    if (!json.exists) {
      msg.channel.send(
        `${x} You have not written a review for Suggester on the Bots on Discord page. Write a review and run the command again for your vote to count!`
      );
      return;
    }

    db.addVote('bod', global.config.bot_lists.bod.points);

    msg.channel.send(`${check} Your review has been counted!`);
  }
}
