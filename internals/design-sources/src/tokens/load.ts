import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  type DtcgGroup,
  type DtcgToken,
  type DtcgType,
  isToken,
} from './dtcg.js';

export const TOKENS_DIR = path.resolve(import.meta.dirname, '../../tokens');

/**
 * Where a file comes from: `figma` files are written by the export and never
 * edited; `code` files are hand-written, for values Figma variables can't hold.
 */
export type SourceOrigin = 'figma' | 'code';

export type SourceFile = {
  /** Path relative to `tokens/`, e.g. `figma/2.theme.dark.tokens.json`. */
  file: string;
  origin: SourceOrigin;
  /** Collection order: a token may reference its own collection or an earlier one. */
  order: number;
  collection: string;
  /** `null` for a collection with a single, unnamed mode. */
  mode: string | null;
  tokens: DtcgGroup;
};

const FILE_NAME =
  /^(?:(\d+)\.)?([a-z0-9-]+)(?:\.([a-zA-Z0-9-]+))?\.tokens\.json$/;

/**
 * `4.breakpoint.xs.tokens.json` → order 4, collection `breakpoint`, mode `xs`.
 * Code files have no order and sort after every Figma collection.
 */
export const parseFileName = (
  fileName: string,
): Pick<SourceFile, 'order' | 'collection' | 'mode'> => {
  const match = FILE_NAME.exec(fileName);
  if (!match) {
    throw new Error(
      `${fileName}: expected <order>.<collection>[.<mode>].tokens.json`,
    );
  }
  const [, order, collection, mode] = match;
  return {
    order: order === undefined ? Number.MAX_SAFE_INTEGER : Number(order),
    collection,
    mode: mode ?? null,
  };
};

/**
 * The Figma files are required: without them every check would pass on zero
 * tokens. Code files are optional, but only a missing folder is skipped.
 */
const readOrigin = (
  dir: string,
  origin: SourceOrigin,
  required: boolean,
): SourceFile[] => {
  const originDir = path.join(dir, origin);
  let names: string[];
  try {
    names = readdirSync(originDir).filter((name) =>
      name.endsWith('.tokens.json'),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    if (required) throw new Error(`No token sources: ${originDir} is missing`);
    return [];
  }
  if (required && names.length === 0) {
    throw new Error(`No token sources: ${originDir} has no .tokens.json file`);
  }
  return names.map((name) => {
    let tokens: DtcgGroup;
    try {
      tokens = JSON.parse(
        readFileSync(path.join(originDir, name), 'utf8'),
      ) as DtcgGroup;
    } catch (error) {
      throw new Error(
        `${origin}/${name}: not valid JSON (${(error as Error).message})`,
      );
    }
    return {
      file: `${origin}/${name}`,
      origin,
      ...parseFileName(name),
      tokens,
    };
  });
};

/** Reads every source file, Figma first, then code, each in merge order. */
export const loadTokenSources = (dir: string = TOKENS_DIR): SourceFile[] =>
  [...readOrigin(dir, 'figma', true), ...readOrigin(dir, 'code', false)].sort(
    (a, b) =>
      a.order - b.order ||
      a.collection.localeCompare(b.collection) ||
      (a.mode ?? '').localeCompare(b.mode ?? ''),
  );

export type Token = {
  /** Path segments as written in the source, e.g. `['color', 'dark', 'crypto', 'Zcash-0%']`. */
  path: string[];
  /** `path` joined with dots: what a `{reference}` points at. */
  id: string;
  $type: DtcgType;
  $value: DtcgToken['$value'];
  $description?: string;
  $extensions?: DtcgToken['$extensions'];
  source: SourceFile;
};

/** Every token of a file, with group `$type`s inherited as DTCG specifies. */
export const flattenTokens = (source: SourceFile): Token[] => {
  const tokens: Token[] = [];
  const walk = (
    node: DtcgGroup,
    tokenPath: string[],
    inheritedType?: DtcgType,
  ): void => {
    const groupType = (node.$type as DtcgType | undefined) ?? inheritedType;
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$') || typeof child !== 'object' || !child) continue;
      const childPath = [...tokenPath, key];
      if (isToken(child)) {
        tokens.push({
          path: childPath,
          id: childPath.join('.'),
          $type: (child.$type ?? groupType) as DtcgType,
          $value: child.$value,
          $description: child.$description,
          $extensions: child.$extensions,
          source,
        });
      } else {
        walk(child as DtcgGroup, childPath, groupType);
      }
    }
  };
  walk(source.tokens, []);
  return tokens;
};
