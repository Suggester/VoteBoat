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
  process.exit(1); // eslint-disable-line no-process-exit
}

global.config = parsed as BotConfig;

export function configCheck(exit = true) {
  const requiredParams: string[] = [
    'TOKEN',
    'PORT',
    'PREFIX',
    'LOG_HOOK_ID',
    'LOG_HOOK_TOKEN',
    'TOPGG_KEY',
    'BOTLISTSPACE_KEY',
  ];
  const missing: string[] = [];

  for (const prop of requiredParams) {
    if (!(prop in global.config)) {
      missing.push(prop);
    }
  }

  if (exit && missing.length > 0) {
    process.exit(1); // eslint-disable-line no-process-exit
  }

  return missing;
}
