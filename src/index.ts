import 'module-alias/register';
import './util/env';
import {startServer} from './util/server';
import {VoteBoatClient} from '@client';

const client = new VoteBoatClient({
  token: global.config.token,
  dirs: {
    events: global.config.dirs.events,
    cmds: global.config.dirs.cmds,
  },
});

startServer(client);
client.init();

// TODO: database
// TODO: process.env => global.config
// TODO: timers
// TODO: commands
//   TODO: stats
//   TODO: notify
//   TODO: help
