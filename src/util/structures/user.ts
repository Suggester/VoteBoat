import {Structures, Client} from 'discord.js';
import {User} from '../db';
import {UserDoc} from '@types';

Structures.extend('User', U => {
  return class extends U {
    _client: Client;
    _data: object;

    constructor(client: Client, data: object) {
      super(client, data);

      this._client = client;
      this._data = data;
    }

    async db(): Promise<UserDoc> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await (User as any).getOrCreate(this.id)) as UserDoc; // typecasting go brr
    }
  };
});
