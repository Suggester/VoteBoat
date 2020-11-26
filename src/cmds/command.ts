import {Client, Message} from 'discord.js';

export abstract class Cmd {
  name = '';
  aliases: string[] = [];
  perms = 0;
  skip = false;
  help = {
    desc: 'This command has not been documented yet.',
    usage: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(arg0?: any) {
    if (arg0) {
      Object.assign(this, arg0);
    }
  }

  init() {}

  abstract run(arg0: Client, arg1: Message): Promise<void>;

  checkPerms(msg: Message): boolean {
    /*
     * -1: no one/disabled
     * 0: anyone
     * 5: moderator/staff role
     * 10: admin only
     */
    switch (this.perms) {
      case -1: {
        return false;
      }
      case 0:
        return true;
      case 5: {
        return (
          global.config.admins.includes(msg.author.id) ||
          !!msg.member?.roles.cache.some(e =>
            global.config.staff_roles.includes(e.id)
          )
        );
      }
      case 10: {
        return global.config.admins.includes(msg.author.id);
      }
    }
    return false;
  }
}
