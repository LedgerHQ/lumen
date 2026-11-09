import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import prettier from 'prettier';
import type { Target } from './target.js';

export const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../..');

/** A target's files after formatting, keyed by workspace-relative path. */
export type RenderedFiles = Map<string, string>;

/** The files under `outDir` a target owns, workspace-relative. */
export const ownedFiles = <Model>(
  target: Pick<Target<Model>, 'outDir' | 'owns'>,
  root: string = WORKSPACE_ROOT,
): string[] =>
  listFiles(target.outDir, root).filter(
    (file) => target.owns?.(path.posix.relative(target.outDir, file)) ?? true,
  );

const FORMATTED = /\.(ts|tsx|js|mjs|json|css)$/;

/** Formats like the repo does, so generated files never show lint noise. */
const format = async (file: string, contents: string): Promise<string> => {
  if (!FORMATTED.test(file)) return contents;
  const absolute = path.join(WORKSPACE_ROOT, file);
  // Pass the file, not its directory: prettier searches config from the
  // argument's parent, so a directory would look one level too high.
  const config = await prettier.resolveConfig(absolute);
  return prettier.format(contents, { ...config, filepath: absolute });
};

export const renderTarget = async <Model>(
  target: Target<Model>,
  model: Model,
  root: string = WORKSPACE_ROOT,
): Promise<RenderedFiles> => {
  const files = await target.emit(model);
  const rendered: RenderedFiles = new Map();
  for (const { path: relative, contents } of files) {
    const file = path.posix.join(target.outDir, relative);
    if (rendered.has(file)) {
      throw new Error(`${target.name} emits ${file} twice`);
    }
    rendered.set(
      file,
      root === WORKSPACE_ROOT && target.format !== false
        ? await format(file, contents)
        : contents,
    );
  }
  return rendered;
};

/** Every file under a folder, workspace-relative, or nothing if it doesn't exist. */
export const listFiles = (
  dir: string,
  root: string = WORKSPACE_ROOT,
): string[] => {
  const absolute = path.join(root, dir);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const child = path.posix.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(child, root) : [child];
  });
};

/** Deletes folders a prune left empty, deepest first; keeps `dir` itself. */
const removeEmptyFolders = (dir: string): void => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = path.join(dir, entry.name);
    removeEmptyFolders(child);
    if (readdirSync(child).length === 0) rmdirSync(child);
  }
};

export type WriteReport = { written: string[]; deleted: string[] };

/** Writes a target's files and deletes the ones it no longer emits. */
export const writeRendered = <Model>(
  target: Pick<Target<Model>, 'outDir' | 'owns'>,
  rendered: RenderedFiles,
  root: string = WORKSPACE_ROOT,
): WriteReport => {
  const written: string[] = [];
  for (const [file, contents] of rendered) {
    const absolute = path.join(root, file);
    const current = existsSync(absolute)
      ? readFileSync(absolute, 'utf8')
      : null;
    if (current === contents) continue;
    mkdirSync(path.dirname(absolute), { recursive: true });
    writeFileSync(absolute, contents);
    written.push(file);
  }

  const deleted = ownedFiles(target, root).filter(
    (file) => !rendered.has(file),
  );
  for (const file of deleted) unlinkSync(path.join(root, file));
  removeEmptyFolders(path.join(root, target.outDir));

  return { written, deleted };
};
