import {BotConfig} from '@types';
import {safeLoad} from 'js-yaml';
import {readFileSync} from 'fs';

let path = 'config.yml';

switch (process.env.NODE_ENV) {
  case 'production':
  case 'prod': {
    path = 'config.yml';
    break;
  }

  case 'staging': {
    path = 'config.staging.yml';
    break;
  }

  case 'development':
  case 'dev':
  default: {
    path = 'config.dev.yml';
    break;
  }
}

const content = readFileSync(path, 'utf8');
const parsed = safeLoad(content);

if (!parsed) {
  throw new Error('Unable to parse config');
}

global.config = parsed as BotConfig;

const missing = configCheck();

if (missing.length) {
  throw new Error(`Missing config elements: ${missing.join(', ')}`);
}

export function configCheck() {
  const requiredParams = [
    'token',
    'bot_id',
    'mongo_db_uri',
    'whitelisted_guilds',
    'admins',
    'staff_roles',
    'prefix',
    'port',
    'root',
    'emojis',
    'log_hook',
    'bot_lists',
    'shop',
  ];

  const missing: string[] = [];

  for (const prop of requiredParams) {
    if (!(prop in global.config)) {
      missing.push(prop);
    }
  }

  return missing;
}
