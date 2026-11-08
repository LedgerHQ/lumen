import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Freezes every generated symbol by path and content hash, so moving the icon
 * flow onto the shared pipeline (DLS-1177) can prove it changed nothing. A
 * changed fill, prop or export fails even when no file is renamed.
 */

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../..');

const GENERATED_SYMBOLS = [
  'libs/design-core/symbols/icons',
  'libs/ui-react/src/lib/Components/symbols/icons',
  'libs/ui-react/src/lib/Components/symbols/index.ts',
  'libs/ui-rnative/src/lib/Components/symbols/icons',
  'libs/ui-rnative/src/lib/Components/symbols/index.ts',
];

const listFiles = (relativePath: string): string[] => {
  const absolute = path.join(WORKSPACE_ROOT, relativePath);
  if (statSync(absolute).isDirectory()) {
    return readdirSync(absolute)
      .sort()
      .flatMap((entry) => listFiles(path.posix.join(relativePath, entry)));
  }
  return [relativePath];
};

const hashFile = (relativePath: string): string =>
  createHash('sha256')
    .update(readFileSync(path.join(WORKSPACE_ROOT, relativePath)))
    .digest('hex')
    .slice(0, 16);

describe('generated symbols snapshot', () => {
  it('keeps every generated symbol file unchanged', async () => {
    const hashes = Object.fromEntries(
      GENERATED_SYMBOLS.flatMap(listFiles).map((file) => [
        file,
        hashFile(file),
      ]),
    );

    await expect(`${JSON.stringify(hashes, null, 2)}\n`).toMatchFileSnapshot(
      '__snapshots__/symbols.json',
    );
  });
});
