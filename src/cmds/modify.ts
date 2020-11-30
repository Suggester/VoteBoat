import {Cmd} from './command';
import {Client, Message, Util} from 'discord.js';
import {getUser, listInfo} from '../util/util';
import {UserDoc, BotList} from '@types';
import {inspect} from 'util';

export default class extends Cmd {
  name = 'modify';
  aliases = ['mod', 'edit', 'db'];
  perms = 5;

  help = {
    desc: `Modify a user's stats

lists: ${['global', ...listInfo.keyArray()].map(l => `'${l}'`).join(', ')}

\`<amount>\` must be prefixed with an operator:

+10: Add 10 to the user's balance
-10: Subtract 10 from the user's balance
=10: Set the user's balance to 10`,
    usage: '<user> [<list> <amount>]',
  };

  constructor() {
    super();
  }

  async run(_client: Client, msg: Message): Promise<void> {
    const {x, check} = global.config.emojis;

    if (!msg.args) {
      msg.channel.send(`${x} Incorrect number of arguments.`);
      return;
    }

    const arg0 = msg.args.shift();
    const user = await getUser(msg, arg0);

    if (!user) {
      msg.channel.send(`${x} I could not find that user.`);
      return;
    }

    const db: UserDoc = await user.db();
    const dbCopy: UserDoc = {...db.toObject()};

    const list = msg.args.shift()!;
    const lists = Object.keys(global.config.bot_lists);

    if (!list) {
      msg.channel.send(inspect(db.toObject()), {code: 'js'});
      return;
    }

    if (![...lists, 'global'].includes(list.toLowerCase())) {
      msg.channel.send(
        `${x} That list does not exist. Available lists: ${lists
          .map(l => `\`${l}\``)
          .join(', ')}`
      );
      return;
    }

    const botList: BotList = list as BotList;

    const num = msg.args.shift()!;
    const operationRegex = /^(?<op>[+-=])(?<amt>\d+)$/g;
    const execd = operationRegex.exec(num);

    // if (!execd || !execd.groups?.amt || !execd.groups?.ops) {
    //   msg.channel.send(inspect(db.toObject()), {code: 'js'});
    //   return;
    // }

    if (!execd || !execd.groups?.amt) {
      msg.channel.send(`${x} Incorrect syntax`);
      return;
    }

    const amt = parseInt(execd.groups.amt);

    switch (execd.groups.op) {
      case '+': {
        db.points += amt;

        if (list !== 'global') {
          db.lists[botList].total += amt;
          for (let i = 0; i < amt; i++) {
            db.lists[botList].votes.push(Date.now());
          }
        }

        break;
      }

      case '-': {
        db.points = db.points - amt <= 0 ? 0 : (db.points -= amt);

        if (list !== 'global') {
          db.lists[botList].total =
            db.lists[botList].total - amt <= 0
              ? 0
              : db.lists[botList].total - amt;

          for (let i = 0; i < amt; i++) {
            db.lists[botList].votes.pop();
          }
        }
        break;
      }

      case '=': {
        db.points = amt;

        if (list !== 'global') {
          db.lists[botList].total = amt;
        }

        break;
      }
    }

    const saved = await db.save();

    if (!saved) {
      msg.channel.send(`${x} Unable to process change.`);
      return;
    }

    msg.channel.send(
      `${check} Updated \`${Util.escapeMarkdown(
        user.tag
      )}\`'s votes for list: \`${list}\`\n> Before: \`${
        list === 'global' ? dbCopy.points : dbCopy.lists[botList].total
      }\`\n> After: \`${
        list === 'global'
          ? saved.toObject().points
          : saved.toObject().lists[list].total
      }\``
    );
  }
}
