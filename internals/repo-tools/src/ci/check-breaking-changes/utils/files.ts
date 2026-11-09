import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Every file under `dir`, recursively, skipping `node_modules`. */
export function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) return [path];
    return name === 'node_modules' ? [] : filesUnder(path);
  });
}
