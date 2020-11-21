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

  constructor() {}

  async run(_client: Client, _msg: Message): Promise<void> {}

  checkPerms(msg: Message): boolean {
    const devs: string[] = ['255834596766253057', '327887845270487041'];

    switch (this.perms) {
      case 0:
        return true;
      case 10: {
        return devs.includes(msg.author.id);
      }
    }

    return false;
  }
}
