import {model, Schema, connect, set as mongooseSet} from 'mongoose';
import {UserDoc, BotLists} from '@types';

mongooseSet('useCreateIndex', true); // get rid of that annoying deprecation warning

const dbUser = new Schema({
  id: {type: String, required: true, unique: true},
  points: {type: Number, default: 0},
  lists: {
    topgg: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
    botlistspace: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
    bfd: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
    dbl: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
    dboats: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
    arcane: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
    legacy: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
    bod: {
      total: {type: Number, default: 0},
      votes: {type: [Number], default: []},
    },
  },
});

dbUser.methods.addVote = function (list: BotLists, points = 1) {
  this.lists[list].votes.push(Date.now());
  this.lists[list].total += points;
  this.points += points;

  this.save();

  return this;
};

dbUser.methods.lifetimeTotal = function (): number {
  const lists: UserDoc['lists'] = this.lists;
  const vals = Object.values(lists);
  const total = vals
    .filter(e => typeof e === 'object')
    .reduce((t, c) => t + c.total, 0);

  return total;
};

dbUser.statics.getOrCreate = async function (id: string) {
  const found = await User.findOne({id});

  if (found) {
    return found;
  }

  return new User({id}).save();
};

export const User = model('user', dbUser);

export async function initDb() {
  connect(global.config.mongo_db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
