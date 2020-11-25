import 'module-alias/register';
import './util/env';
import {VoteBoatClient} from '@client';

new VoteBoatClient({
  token: global.config.token,
  dirs: {
    events: global.config.dirs.events,
    cmds: global.config.dirs.cmds,
  },
}).init();

// TODO: process.env => global.config
// TODO: timers
// TODO: commands
//   TODO: stats
//   TODO: notify
//   TODO: help
//   TODO: modify
// TODO: cache stuff to reduce database calls?
