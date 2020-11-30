import {Request, Response, Router} from 'express';
import {Client} from 'discord.js';
import {List} from './list';

export default class extends List {
  constructor(public client: Client, router: Router) {
    super(
      {endpoint: '/dboats', name: 'Discord Boats', id: 'dboats'},
      client,
      router
    );
  }

  handleRequest(req: Request, res: Response) {
    if (!super.checkOrigin(global.config.bot_lists.dboats.key, req, res)) {
      return;
    }

    super.sendEmbed(req.body.user.id);
    super.saveVote(req.body.user.id);
  }
}

/*
example webhook body:
{
  bot: {
    id: 'bot id',
    name: 'bot name'
  },
  user: {
    id: 'user id',
    username: 'ben!',
    discriminator: 0002
  }
}
*/
