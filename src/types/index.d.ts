declare module 'discord.js' {
  export interface ClientOptions {
    token: string;
    dirs: {
      events: string;
      cmds: string;
    };
  }

  export interface Client {
    events: Collection<string, VoteBoatEvent>;
    cmds: Collection<string, VoteBoatCmd>;
    /**
     * Initialize the client and start the bot
     * - Load commands
     * - Load events
     * - Login
     */
    init(): Promise<void>;
  }

  export interface Message {
    command?: string;
    args?: string[];
  }

  export interface VoteBoatEvent {
    name: string;
    skip?: boolean;

    run(client: Client, ...args: any[]): Promise<void>; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  export interface VoteBoatCmd {
    name: string;
    aliases: string[];
    perms: number;
    help: {
      desc: string;
      usage?: string;
    };

    skip?: boolean;

    run(client: Client, ...args: any[]): Promise<void>; // eslint-disable-line @typescript-eslint/no-explicit-any
    checkPerms(msg: Message): boolean;
  }
}

export interface Constructable<T> {
  new (...args: any[]): T; // eslint-disable-line @typescript-eslint/no-explicit-any
}
