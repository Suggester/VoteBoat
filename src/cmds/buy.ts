import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import {Embed} from '../util/structures/embed';
import {BotConfig} from '@types';

export default class extends Cmd {
  name = 'buy';
  aliases = ['store', 'shop'];
  perms = 0;

  help = {
    desc: 'Spend your votes!',
    usage: '[item-id]',
  };

  constructor() {
    super();
  }

  async run(client: Client, msg: Message): Promise<void> {
    const items: BotConfig['shop']['items'] = global.config.shop.items;
    const selectedItem = msg.args?.shift();
    const db = await msg.author.db();
    const {
      prefix,
      emojis: {x, check},
    } = global.config;

    if (!selectedItem) {
      const e = new Embed(client)
        .setDescription(
          'With your votes, you can buy various items like roles and acknowledgments!\n\n**Available Rewards** \n'
        )
        .addField(
          'Buying Rewards',
          `To purchase a reward, use the ${prefix}${this.name} command, followed by the number of the item you would like to buy.\n` +
            `> Example: Buying **${items.find(i => i.id === 1)?.name}**:\n` +
            `> \`${prefix}${this.name} 1\``
        )
        .addField(
          'Additional Info',
          `If an item is prefixed with ${x}, it means you do not meet the prerequisites to purchase that item. Items prefixed with ${check} are already owned.`
        )
        .setFooter(`Balance: ${db.toObject().points}`)
        .setColor('#4187ec');

      for (const item of items) {
        const meetsReqs = this.meetsReqs(msg, items, item.id);
        let hasRole = false;

        if (item.type === 'role') {
          hasRole = !!msg.member?.roles.cache.has(item.role_id || '');
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
          const prereqs = item.prereq
            .map(i => `\`${items.find(a => a.id === i)?.name}\``)
            .join(', ');

          e.description += `\n> **Prerequisite${
            item.prereq.length === 1 ? '' : 's'
          }**: ${prereqs}`;
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

    if (!this.meetsReqs(msg, items, item.id)) {
      msg.channel.send(
        `${x} You do not meet all of the prerequisites for **${item.name}**. For more info, refer to \`${global.config.prefix}${this.name}\``
      );

      return;
    }

    if (msg.member?.roles.cache.has(item?.role_id || '')) {
      msg.channel.send(`${x} You have already purchased **${item.name}**`);
      return;
    }

    db.points -= item.price;
    await db.save();

    if (item.type === 'role') {
      await msg.member?.roles.add(item?.role_id || '');
    }

    msg.channel.send(`${check} Successfully purchased **${item.name}**.`);
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
          e => e.id === i && e.type === 'role' && e.role_id
        );

        if (!found) {
          return false;
        }

        return msg.member?.roles.cache.has(found.role_id!);
      });
    }

    return meetsReqs;
  }
}
