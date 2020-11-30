import 'module-alias/register';
import './util/env';
import {VoteBoatClient} from '@client';

new VoteBoatClient({
  token: global.config.token,
  dirs: {
    events: 'build/src/events',
    cmds: 'build/src/cmds',
  },
}).init();

// TODO: voting streaks
// TODO: overload sendEmbed in topgg to show weekend votes?
