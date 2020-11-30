import {Request, Response, Router} from 'express';
import {Client} from 'discord.js';
import {List} from './list';

export default class extends List {
  constructor(public client: Client, router: Router) {
    super(
      {endpoint: '/dbl', name: 'Discord Bot List', id: 'dbl'},
      client,
      router
    );
  }

  handleRequest(req: Request, res: Response) {
    if (!super.checkOrigin(global.config.bot_lists.dbl.key, req, res)) {
      return;
    }

    super.sendEmbed(req.body.id);
    super.saveVote(req.body.id);
  }
}

/*
example webhook body:
{
  admin?: true,
  avatar?: 'avatar hash',
  username: 'ben!',
  id: 'user id'
}
*/
