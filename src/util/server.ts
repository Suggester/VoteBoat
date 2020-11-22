import express, {Router} from 'express';
import {fileloader} from './util';
import {basename} from 'path';
import {Client} from 'discord.js';

export async function startServer(client: Client) {
  const app = express();
  const router = Router();

  app.use(express.json());
  app.use(global.config.root, router);

  app.listen(global.config.port, () => {
    console.log('Listening on port', global.config.port);
  });

  // -- load endpoints --

  const files = fileloader('build/src/lists');

  for await (const file of files) {
    if (basename(file.toString()) === 'list.js') {
      continue;
    }

    const List = (await import(file.toString())).default;

    const l = new List(client, router);

    console.log(
      '[R] Loaded route:',
      global.config.root === '/' ? l.endpoint : global.config.root + l.endpoint
    );
  }
}
