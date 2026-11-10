import { mkdirSync, mkdtempSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { workspaceRoot } from '../../../shared/workspaceProjects.ts';

/** Every file under `dir`, recursively, skipping `node_modules`. */
export function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) return [path];
    return name === 'node_modules' ? [] : filesUnder(path);
  });
}

/**
 * A new folder in the workspace's gitignored `tmp/`. Unpacked `.d.ts` files
 * must live there: their bare imports (`react`) resolve through its `node_modules`.
 */
export function workspaceTempDir(prefix: string): string {
  const base = join(workspaceRoot, 'tmp');
  mkdirSync(base, { recursive: true });
  return mkdtempSync(join(base, prefix));
}
