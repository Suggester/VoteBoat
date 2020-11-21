import {config} from 'dotenv';

switch (process.env.NODE_ENV) {
  case 'production':
  case 'prod': {
    config({path: './.env'});
    break;
  }

  case 'staging': {
    config({path: './.env.staging'});
    break;
  }

  case 'development':
  case 'dev':
  default: {
    config({path: './.env.dev'});
    break;
  }
}

envCheck(true);

export function envCheck(exit = false): string[] {
  const requiredParams: string[] = ['TOKEN', 'PORT', 'PREFIX'];
  const missing: string[] = [];

  for (const prop of requiredParams) {
    if (!(prop in process.env)) {
      missing.push(prop);
    }
  }

  if (exit && missing.length > 0) {
    process.exit(1); // eslint-disable-line no-process-exit
  }

  return missing;
}
