import 'module-alias/register';
import './util/env';
import {VoteBoatClient} from '@client';

const client = new VoteBoatClient({
  token: process.env.TOKEN!,
  dirs: {
    events: __dirname + '/events',
    cmds: __dirname + '/cmds',
  },
});

client.init();
