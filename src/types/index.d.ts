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
    init(): Promise<void>;
  }

  export interface Message {
    command?: string;
    args?: string[];
  }

  export interface User {
    db(): Promise<UserDoc>;
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
  id: BotList;
  method?: 'get' | 'put' | 'post' | 'patch' | 'delete';
}

export interface BotConfig {
  token: string;
  bot_id: string;
  mongo_db_uri: string;
  whitelisted_guilds: string[];
  admins: string[];
  staff_roles: string[];
  prefix: string;
  port: number;
  root: string;

  emojis: {
    x: string;
    check: string;
  };

  log_hook: {
    id: string;
    token: string;
  };

  dirs: {
    events: string;
    cmds: string;
  };

  bot_lists: {
    [key in BotList]: {
      name: string;
      key: string;
      points: number;
      votes_per_day: 1 | 2;
    };
  };

  shop: {
    items: {
      type: 'role' | 'other';
      id: number;
      name: string;
      desc: string;
      price: number;
      prereq?: number[];

      role_id?: string;

      /** @deprecated */
      role?: {
        id: string;
      };
    }[];
  };
}

export type BotList =
  | 'topgg'
  | 'botlistspace'
  | 'bfd'
  | 'dbl'
  | 'dboats'
  | 'arcane'
  | 'bod'
  | 'legacy';

export type ValueOf<T> = T[keyof T];

export interface UserDoc extends Document {
  _id: string;
  id: string;
  points: number;
  notify: boolean;
  lists: {
    [key in BotList]: {
      total: number;
      votes: number[];
      sentReminder: boolean;
    };
  };
  addVote(list: BotList, points: number): UserDoc;
  lifetimeTotal(): number;
}

export interface UserDocInstance extends Document {
  addVote(list: BotList, points: number): UserDocInstance;
  lifetimeTotal(): number;
}
