import {Request, Response, Router} from 'express';
import {Client, UserResolvable} from 'discord.js';
import {Embed} from '../util/structures/embed';
import {ListOptions, UserDoc, BotList} from '@types';
import {User} from '../util/db';

export abstract class List {
  endpoint: string;
  name: string;
  id: BotList;

  constructor(ops: ListOptions, public client: Client, public router?: Router) {
    this.endpoint = ops.endpoint;
    this.name = ops.name;
    this.id = ops.id;

    if (this.router) {
      this.router?.post(this.endpoint, this.handleRequest.bind(this));
    }
  }

  abstract handleRequest(arg0: Request, arg1: Response): void | Promise<void>;

  checkOrigin(key: string, req: Request, res?: Response) {
    const areEqual = req.headers?.authorization === key;

    if (res) {
      res.status(areEqual ? 200 : 403).send();
    }

    return areEqual;
  }

  async sendEmbed(user: UserResolvable): Promise<void> {
    const u =
      this.client.users.cache.get(user.valueOf()) ||
      (await this.client.users.fetch(user.valueOf()));

    const tag = u?.tag || 'Unknown#0000';

    const {id, token} = global.config.log_hook;

    return new Embed(this.client)
      .setDescription(`${tag} just voted for Suggester on ${this.name}!`)
      .sendWebhook(id, token);
  }

  async saveVote(id: string, amt = 1) {
    // add vote to user db
    console.log('Adding', amt, 'to user', id, 'for list', this.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((await (User as any).getOrCreate(id)) as UserDoc).addVote(this.id, amt); // ree tsc
  }
}
