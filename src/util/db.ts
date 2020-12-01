import {model, Schema, connect, set as mongooseSet} from 'mongoose';
import {UserDoc, BotList, ValueOf} from '@types';

mongooseSet('useCreateIndex', true); // get rid of that annoying deprecation warning

const dbUser = new Schema({
  id: {type: String, required: true, unique: true},
  points: {type: Number, default: 0},
  notify: {type: Boolean, default: true},
  lists: {
    topgg: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
    botlistspace: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
    bfd: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
    dbl: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
    dboats: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
    arcane: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
    legacy: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
    bod: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
      sentReminder: {type: Boolean, default: false},
    },
  },
});

dbUser.method({
  lifetimeTotal() {
    const lists: UserDoc['lists'] = this.lists;
    const vals = Object.values(lists);
    const total = vals
      .filter(e => typeof e === 'object')
      .reduce((t, c) => t + c.total, 0);

    return total;
  },

  addVote(list: BotList, points = 1, resetReminder = true) {
    this.lists[list].votes.push(Date.now());
    this.lists[list].total += points;
    this.points += points;

    if (resetReminder) {
      this.lists[list].sentReminder = false;
    }

    this.save();

    return this;
  },
});

dbUser.static({
  async getOrCreate(id: string) {
    const found = await User.findOne({id});

    if (found) {
      return found;
    }

    return new User({id}).save();
  },
});

export const User = model('user', dbUser);

export async function initDb() {
  connect(global.config.mongo_db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
