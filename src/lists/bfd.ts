import {Request, Response, Router} from 'express';
import {Client} from 'discord.js';
import {List} from './list';

export default class extends List {
  constructor(public client: Client, router: Router) {
    super(
      {endpoint: '/bfd', name: 'Bots for Discord', id: 'bfd'},
      client,
      router
    );
  }

  handleRequest(req: Request, res: Response) {
    if (!super.checkOrigin(global.config.bot_lists.bfd.key, req, res)) {
      return;
    }

    super.sendEmbed(req.body.user);
    super.saveVote(req.body.user);
  }
}

/*
example webhook body:
{
  user: 'user id',
  bot: 'bot id',
  type: 'vote',
  votes: {
    totalVotes: 1,
    votes24: 1,
    votesMonth: 1,
    hasVoted: [123, 456],
    hasVoted24: [789, 012]
  }
}
*/
