import {User, Message, Collection} from 'discord.js';
import {promises, PathLike} from 'fs';
import {resolve} from 'path';
import {BotLists} from '@types';

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

const botId = global.config.bot_id;

export const listInfo: Collection<
  BotLists,
  {name: string; url: string}
> = new Collection([
  ['topgg', {name: 'top.gg', url: `https://top.gg/bot/${botId}`}],
  ['botlistspace', {name: 'botlist.space', url: `https://top.gg/bot/${botId}`}],
  ['bfd', {name: 'Bots For Discord', url: `https://top.gg/bot/${botId}`}],
  ['dbl', {name: 'Discord Bot List', url: `https://top.gg/bot/${botId}`}],
  ['dboats', {name: 'DBoats', url: `https://top.gg/bot/${botId}`}],
  ['arcane', {name: 'Arcane Center', url: `https://top.gg/bot/${botId}`}],
  ['legacy', {name: 'Legacy', url: ''}],
]);
