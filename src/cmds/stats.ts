import {Cmd} from './command';
import {Client, Message, Collection} from 'discord.js';
import {BotLists, UserDoc, ValueOf} from '@types';
import {getUser} from '../util/util';
import {Embed} from '../util/structures/embed';

export default class extends Cmd {
  name = 'stats';
  perms = 0;

  constructor() {
    super();
  }

  async run(client: Client, msg: Message): Promise<void> {
    let user = msg.author;

    if (msg.args?.length) {
      user = (await getUser(msg))!; // tsc pls

      if (!user) {
        msg.channel.send(':x: I could not find that user.');
        return;
      }
    }

    const botId = client.user?.id;

    const listInfo: Collection<
      BotLists,
      {name: string; url: string}
    > = new Collection([
      ['topgg', {name: 'top.gg', url: `https://top.gg/bot/${botId}`}],
      [
        'botlistspace',
        {name: 'botlist.space', url: `https://top.gg/bot/${botId}`},
      ],
      ['bfd', {name: 'Bots For Discord', url: `https://top.gg/bot/${botId}`}],
      ['dbl', {name: 'Discord Bot List', url: `https://top.gg/bot/${botId}`}],
      ['dboats', {name: 'DBoats', url: `https://top.gg/bot/${botId}`}],
      ['arcane', {name: 'Arcane Center', url: `https://top.gg/bot/${botId}`}],
      ['legacy', {name: 'Legacy', url: ''}],
    ]);

    // ['bod', {name: 'bots on discord', url: `https://top.gg/bot/${botId}`}],
    const found: UserDoc = await user.db();

    const entries: [string, ValueOf<UserDoc['lists']>][] = Object.entries(
      found.toObject().lists
    );

    const mapped = entries
      .map(l => {
        const info = listInfo.get(l[0] as BotLists);

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
          }\` \n\n<:streak3:690377163827970049> Streak: \`2/5\``,
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

    // msg.channel.send(
    //   `Lifetime Total: ${total}\nCurrent Total: ${found?.points}\nLists:\n${mapped}`
    // );

    // msg.channel.send(inspect(found), {code: 'js'});
  }
}
