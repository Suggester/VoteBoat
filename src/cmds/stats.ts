import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import {BotList, UserDoc, ValueOf} from '@types';
import {getUser, listInfo} from '../util/util';
import {Embed} from '../util/structures/embed';

export default class extends Cmd {
  name = 'stats';
  aliases = ['bal'];
  perms = 0;

  constructor() {
    super();
  }

  async run(client: Client, msg: Message): Promise<void> {
    const {x} = global.config.emojis;
    let user = msg.author;

    if (msg.args?.length) {
      user = (await getUser(msg))!; // tsc pls

      if (!user) {
        msg.channel.send(`${x} I could not find that user.`);
        return;
      }
    }

    const found: UserDoc = await user.db();

    const entries: [string, ValueOf<UserDoc['lists']>][] = Object.entries(
      found.toObject().lists
    );

    const mapped = entries
      .map(l => {
        const info = listInfo.get(l[0] as BotList);

        if (!info) {
          return;
        }
        return `- **[${info!.name}](${info!.url})**: ${l[1].total}`;
      })
      .filter(Boolean) // remove empty ones
      .join('\n');

    new Embed(client)
      .setTitle('Voting Stats')
      .setURL('https://suggester.js.org')
      .setColor(16560669)
      .addFields(
        {
          name: 'Votes',
          value: `<:suggestercircle:739927564646088765> Lifetime Votes: \`${found.lifetimeTotal()}\`\n📥  Current Votes: \`${
            found.points
          }\` \n\n:calendar: Streak: soon:tm:`,
          // value: `<:suggestercircle:739927564646088765> Lifetime Votes: \`${found.lifetimeTotal()}\`\n📥  Current Votes: \`${
          //   found.points
          // }\` \n\n<:streak3:690377163827970049> Streak: \`2/5\``,
        },
        {
          name: 'Lists',
          value: mapped,
        },
        {
          name: 'Reviews',
          value:
            '<:suggester_x:704665482828972113> Glen Bot List\n<:suggester_check:704665656573952040> Top.gg',
        }
      )
      .setFooter(`Use ${global.config.prefix}shop to spend your votes!`)
      .setTimestamp()
      .send(msg.channel.id);
  }
}
