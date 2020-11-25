import {User} from 'discord.js';
import {Message} from 'discord.js';
import {promises, PathLike} from 'fs';
import {resolve} from 'path';

export async function* fileloader(
  dir: string
): AsyncIterableIterator<PathLike> {
  const files = await promises.readdir(dir, {withFileTypes: true});

  for (const file of files) {
    const resolved = resolve(dir, file.name);

    if (file.isDirectory()) {
      yield* fileloader(resolved);
    } else {
      yield resolved;
    }
  }
}

export async function getUser(
  {args, client: {users}}: Message,
  text?: string
): Promise<User | undefined> {
  const regex = new RegExp('^(?<id>\\d{16,18})$|<@!?(?<pingid>\\d{16,18})>$');

  const words = text ?? (args?.join(' ') || '');
  const matched = regex.exec(words);
  const id = matched?.groups?.id || matched?.groups?.pingid;

  if (!id) return;

  return users.cache.get(id) || users.fetch(id);
}
