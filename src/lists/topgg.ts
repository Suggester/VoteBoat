import {Request, Response, Router} from 'express';
import {Client} from 'discord.js';
import {List} from './list';

export default class extends List {
  constructor(public client: Client, router: Router) {
    super({endpoint: '/topgg', name: 'Top.gg', id: 'topgg'}, client, router);
  }

  handleRequest(req: Request, res: Response) {
    if (!super.checkOrigin(global.config.bot_lists.topgg.key, req, res)) {
      return;
    }

    super.sendEmbed(req.body.user_id);
    super.saveVote(req.body.user_id);
  }
}
