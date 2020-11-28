import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import {Embed} from '../util/structures/embed';
import {BotConfig} from '@types';

export default class extends Cmd {
  name = 'buy';
  aliases = ['store', 'shop'];
  perms = 0;

  constructor() {
    super();
  }

  async run(client: Client, msg: Message): Promise<void> {
    const items: BotConfig['shop']['items'] = global.config.shop.items;
    const selectedItem = msg.args?.shift();
    const db = await msg.author.db();
    const {x, check} = global.config.emojis;

    if (!selectedItem) {
      const e = new Embed(client)
        .setDescription(
          `if an item is prefixed with ${x} u dont meet the reqs lol. loser :pepepointlaugh:\nif its prefixed with ${check} it means u hvae it (roles only)\n`
        )
        .setFooter(`Balance: ${db.toObject().points}`)
        .setColor('#4187ec');

      for (const item of items) {
        const meetsReqs = this.meetsReqs(msg, items, item.id);
        let hasRole = false;

        if (item.type === 'role') {
          hasRole = !!msg.member?.roles.cache.has(item.role?.id || '');
        }

        if (!meetsReqs) {
          e.description += `${x} `;
        }

        if (hasRole) {
          e.description += `${check} `;
        }

        e.description += `\`${item.id}\` **__${item.name}__**\n`;
        e.description += `> ${item.desc}\n`;
        e.description += `> **Price**: ${item.price}`;

        if (item.prereq) {
          e.description += `\n> **${
            item.prereq.length === 1 ? 'Prerequisite' : 'Prerequisites'
          }**: ${item.prereq
            .map(i => `\`${items.find(a => a.id === i)?.name}\``)
            .join(', ')}`;
        }

        e.description += '\n\n';
      }

      e.send(msg.channel);
      return;
    }

    const item = items.find(i => i.id === parseInt(selectedItem!));

    if (!item) {
      msg.channel.send(
        `${x} I could not find that item. Try running \`${global.config.prefix}${this.name}\` to see all of the items that are available!`
      );

      return;
    }

    if (item.price > db.toObject().points) {
      msg.channel.send(
        `${x} You need ${(
          item!.price - db.toObject().points
        ).toLocaleString()} more votes to buy **${item.name}**!`
      );

      return;
    }

    if (msg.member?.roles.cache.has(item.role?.id || '')) {
      msg.channel.send(`${x} You have already purchased **${item.name}**`);
      return;
    }

    db.points -= item.price;
    await db.save();

    if (item.type === 'role') {
      await msg.member?.roles.add(item.role?.id || '');
    }

    msg.channel.send(`${check} Successfully purchased  **${item.name}**.`);
  }

  meetsReqs(
    msg: Message,
    items: BotConfig['shop']['items'],
    id: number
  ): boolean {
    const item = items.find(i => i.id === id);
    let meetsReqs = true;

    if (item?.prereq) {
      meetsReqs = item?.prereq?.every(i => {
        const found = items.find(
          e => e.id === i && e.type === 'role' && e.role?.id
        );

        return msg.member?.roles.cache.has(found!.role!.id);
      });
    }

    return meetsReqs;
  }
}
