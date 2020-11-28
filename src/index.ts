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

// TODO: streaks
// TODO: commands
//   TODO: help
// TODO: cache stuff to reduce database calls? specifically for reminders
