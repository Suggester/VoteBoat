import {Cmd} from './command';
import {Client, Message} from 'discord.js';
import {Embed} from '../util/structures/embed';
import {listInfo as lists} from '../util/util';

export default class extends Cmd {
  name = 'help';
  aliases = ['commands', 'list'];

  help = {
    desc: 'Get information about voting or help with a specific command',
    usage: '[cmd]',
  };

  constructor() {
    super();
  }

  async run(client: Client, msg: Message) {
    const {
      prefix,
      emojis: {x},
    } = global.config;
    const cmd = msg.args?.shift()?.toLowerCase() || '';

    const found = client.cmds.find(
      c => c.name === cmd || c?.aliases.includes(cmd)
    );

    if (!found) {
      new Embed(client)
        .setTitle('Overview')
        .setURL('https://suggester.js.org#/supporting/info')
        .setAuthor(
          'Supporting Suggester via Voting',
          'https://cdn.discordapp.com/attachments/771497680672784384/782354040490033162/440919592047476742.png'
        )
        .setColor(7506399)
        .setDescription(
          'Voting on various bot listing sites really means a lot! As a thank you for your support, we allow you to purchase many cool things in the server with the votes you accumulate!\n\nTo see the shop, use the `v!shop` command!'
        )
        .addFields(
          {
            name: '<:suggestercircle:739927564646088765> How does it work?',
            value:
              'Each time you vote, it gets logged in #vote-logs and one vote is automatically added to your account!',
          },
          {
            name: '<:streak3:690377163827970049> Exceptions',
            value: `When you vote on [top.gg](${
              lists.get('topgg')?.url
            }) on Friday, Saturday, or Sunday (GMT) you'll receive **2 extra votes**.\n\nIf you you vote **5 times in a row** (by keeping a streak) on any bot list, you'll receive **1 extra vote** per 5-day-streak\n\nIf you leave a review on [Bots on Discord](https://a.com), then use the \`v!checkreview\` command, you'll get **3 extra votes**!`,
          },
          {
            name: '🔗 Links & Cooldowns',
            value: `You can vote on all of the following sites: \n[top.gg](${
              lists.get('topgg')?.url
            }) - Once every 12 hours\n[botlist.space](${
              lists.get('botlistspace')?.url
            }) - Once every 24 hours \n[Bots for Discord](${
              lists.get('bfd')?.url
            }) - Once every day, resets at midnight UTC\n[Discord Bot List](${
              lists.get('dbl')?.url
            }) - Once every 24 hours\n[Discord Boats](${
              lists.get('dboats')?.url
            }) - Once every 12 hours\n`,
          }
        )
        .setFooter('Thank you for your support!')
        .setThumbnail(
          'https://cdn.discordapp.com/attachments/576057292491980800/782344823368843284/757684468764115084.gif'
        )
        .send(msg.channel);

      return;
    }

    if (!found?.checkPerms(msg)) {
      msg.channel.send(
        `${x} You do not have permission to view help for this command`
      );
    }

    const usage = `${prefix}${found.name} ${found.help?.usage}`;
    const aliases = found?.aliases.join(', ') || 'none';
    let perms = '';

    switch (found.perms) {
      case 0: {
        perms = 'Anyone can use this command';
        break;
      }
      case 5: {
        perms = 'Server moderators can use this command';
        break;
      }
      case 10: {
        perms = 'Bot administrators can use this command';
        break;
      }
      default: {
        perms = 'Unknown.';
        break;
      }
    }

    let str = '';

    str += `${found.help.desc}\n\n`;
    str += 'COMMAND:\n';
    str += `\t${found.name}\n`;
    str += 'ALIASES:\n';
    str += `\t${aliases}\n`;
    str += 'USAGE:\n';
    str += `\t${usage}\n`;
    str += 'PERMS:\n';
    str += `\t${perms}`;

    msg.channel.send(str, {code: true});
  }
}
