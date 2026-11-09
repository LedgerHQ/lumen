import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { listFiles, type RenderedFiles, WORKSPACE_ROOT } from './writer.js';

export type CheckReport = {
  /** Committed, but different from what the target emits (hand edit or stale). */
  changed: string[];
  /** Emitted, but not committed. */
  missing: string[];
  /** Committed in the target's folder, but no longer emitted. */
  extra: string[];
};

/** Compares a target's output with the working tree, without writing anything. */
export const checkRendered = (
  outDir: string,
  rendered: RenderedFiles,
  root: string = WORKSPACE_ROOT,
): CheckReport => {
  const changed: string[] = [];
  const missing: string[] = [];
  for (const [file, contents] of rendered) {
    const absolute = path.join(root, file);
    if (!existsSync(absolute)) missing.push(file);
    else if (readFileSync(absolute, 'utf8') !== contents) changed.push(file);
  }
  const extra = listFiles(outDir, root).filter((file) => !rendered.has(file));
  return { changed, missing, extra };
};

export const isClean = ({ changed, missing, extra }: CheckReport): boolean =>
  changed.length + missing.length + extra.length === 0;
