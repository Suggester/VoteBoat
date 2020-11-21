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
