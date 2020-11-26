import {Cmd} from './command';
import {Client, Message, Util} from 'discord.js';
import {getUser} from '../util/util';
import {UserDoc, BotLists} from '@types';

export default class extends Cmd {
  name = 'modify';
  aliases = ['mod', 'edit'];
  perms = 5;

  help = {
    desc: "Modify a user's stats",
    usage: '<user> <list> <amount>',
  };

  constructor() {
    super();
  }

  async run(_client: Client, msg: Message): Promise<void> {
    if (!msg.args || msg.args.length < 3) {
      msg.channel.send(':x: Incorrect number of arguments.');
      return;
    }

    const arg0 = msg.args.shift();
    const user = await getUser(msg, arg0);

    if (!user) {
      msg.channel.send(':x: I could not find that user.');
      return;
    }

    const list = msg.args.shift()!;
    const lists = Object.keys(global.config.bot_lists);

    if (![...lists, 'global'].includes(list.toLowerCase())) {
      msg.channel.send(
        `:x: That list does not exist. Avalable lists: ${lists
          .map(l => `\`${l}\``)
          .join(', ')}`
      );
      return;
    }

    const botList: BotLists = list as BotLists;

    const num = msg.args.shift()!;
    const operationRegex = /^(?<op>[+-=])(?<amt>\d+)$/g;
    const execd = operationRegex.exec(num);

    if (!execd || !execd.groups?.amt) {
      msg.channel.send(':x: Incorrect syntax');
      return;
    }

    const amt = parseInt(execd.groups.amt);

    const db: UserDoc = await user.db();
    const dbCopy: UserDoc = {...db.toObject()};

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
      msg.channel.send(':x: Unable to process change.');
      return;
    }

    msg.channel.send(
      `:white_check_mark: Updated \`${Util.escapeMarkdown(
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
