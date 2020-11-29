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

// TODO: voting streaks
// TODO: write actual sentences (buy.ts)
// TODO: add all bot lists with correct POST body
// TODO: commands
//   TODO: checkreview -- botsondiscord
// TODO: cache stuff to reduce database calls? specifically for reminders
