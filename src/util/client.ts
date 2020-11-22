import './structures/message';

import {
  Client,
  ClientOptions,
  Collection,
  VoteBoatEvent,
  VoteBoatCmd,
} from 'discord.js';
import {Constructable} from '@types';
import {fileloader} from './util';

export class VoteBoatClient extends Client {
  events: Collection<string, VoteBoatEvent> = new Collection();
  cmds: Collection<string, VoteBoatCmd> = new Collection();

  constructor(private ops: ClientOptions) {
    super(ops);
  }

  async init(): Promise<string> {
    this.loadEvents().catch(console.error);
    this.loadCmds().catch(console.error);

    return super.login(this.ops.token);
  }

  private async loadEvents(): Promise<void> {
    const events = fileloader(this.ops.dirs.events);

    for await (const event of events) {
      const Event: Constructable<VoteBoatEvent> = (
        await import(event.toString())
      ).default;

      const e = new Event();

      this.on(e.name, (...args) => {
        e.run(this, ...args);
      });

      this.events.set(e.name, e);

      console.log('[E] Loaded event', e.name);
    }
  }

  private async loadCmds(): Promise<void> {
    const ignore: string[] = ['command.js'];
    const cmds = fileloader(this.ops.dirs.cmds);

    for await (const cmd of cmds) {
      if (ignore.some(c => cmd.toString().endsWith(c))) {
        continue;
      }

      const Command: Constructable<VoteBoatCmd> = (await import(cmd.toString()))
        .default;

      const c = new Command();

      if (c?.skip) {
        continue;
      }

      this.cmds.set(c.name, c);
      console.log('[C] Loaded command', c.name);
    }
  }
}
