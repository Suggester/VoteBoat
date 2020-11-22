import {Document} from 'mongoose';

declare global {
  export namespace NodeJS {
    export interface Global {
      config: BotConfig;
    }
  }
}

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
    init(): Promise<string>;
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

export interface ListOptions {
  endpoint: string;
  name: string;
  id: BotLists;
  method?: 'get' | 'put' | 'post' | 'patch' | 'delete';
}

export type BotLists =
  | 'topgg'
  | 'botlistspace'
  | 'bfd'
  | 'dbl'
  | 'dboats'
  | 'arcane'
  | 'bod';

export interface BotConfig {
  token: string;
  mongo_db_uri: string;
  admins: string[];
  prefix: string;
  port: number;
  root: string;

  log_hook: {
    id: string;
    token: string;
  };

  dirs: {
    events: string;
    cmds: string;
  };

  bot_lists: {
    [key in BotLists]: {
      name: string;
      key: string;
      points: number;
    };
  };

  shop: {
    items: {
      type: 'role';
      id: string;
      name: string;
    }[];
  };
}

export interface UserDoc {
  _id: string;
  lists: {
    [key in BotLists]: {
      total: number;
      votes: number[];
    };
  };
}

export interface UserDocInstance extends Document {
  addVote(list: BotLists, points: number): UserDocInstance;
  total(): number;
}
