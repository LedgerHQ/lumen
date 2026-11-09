import {
  type DtcgGroup,
  type DtcgToken,
  type DtcgValue,
  referenceOf,
} from './dtcg.js';
import {
  flattenTokens,
  loadTokenSources,
  type SourceFile,
  type Token,
} from './load.js';
import { validateSources } from './validate.js';

export type Collection = {
  name: string;
  order: number;
  /** Mode names, in file order; empty for a collection with a single unnamed mode. */
  modes: string[];
};

/** Collection → chosen mode, e.g. `{ theme: 'dark', brand: 'enterprise' }`. */
export type ModeSelection = Record<string, string>;

export class TokenValidationError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(`Invalid design sources:\n- ${errors.join('\n- ')}`);
    this.errors = errors;
  }
}

/** The extension every token in a merged tree carries, so outputs can filter by collection. */
export const LUMEN_EXTENSION = 'com.ledger.lumen';
export type LumenExtension = {
  collection: string;
  mode: string | null;
  file: string;
};

export type TokenModel = {
  sources: SourceFile[];
  collections: Collection[];
  warnings: string[];
  /** The modes of a collection; throws on an unknown collection. */
  modesOf(collection: string): string[];
  /**
   * The files that make up one combination of modes: for each collection in
   * `include`, its single file, or the one for the selected mode.
   */
  select(include: string[], selection?: ModeSelection): SourceFile[];
  /** The tokens of `files`, a later file overriding an earlier one's token. */
  tokens(files: SourceFile[]): Token[];
  /**
   * A token's concrete value within `files`: references are followed, those
   * nested in shadow layers and gradient stops included.
   */
  resolve(token: Token, files: SourceFile[]): DtcgValue;
  /** `files` deep-merged into one DTCG tree, each token tagged with `LUMEN_EXTENSION`. */
  tree(files: SourceFile[]): DtcgGroup;
};

const tagTokens = (node: DtcgGroup, source: SourceFile): DtcgGroup =>
  Object.fromEntries(
    Object.entries(node).map(([key, child]) => {
      if (typeof child !== 'object' || child === null) return [key, child];
      if ('$value' in child) {
        const token = child as DtcgToken;
        return [
          key,
          {
            ...token,
            $extensions: {
              ...token.$extensions,
              [LUMEN_EXTENSION]: {
                collection: source.collection,
                mode: source.mode,
                file: source.file,
              } satisfies LumenExtension,
            },
          },
        ];
      }
      return [key, tagTokens(child as DtcgGroup, source)];
    }),
  );

const deepMerge = (target: DtcgGroup, source: DtcgGroup): DtcgGroup => {
  for (const [key, value] of Object.entries(source)) {
    const existing = target[key];
    if (
      typeof value === 'object' &&
      value !== null &&
      !('$value' in value) &&
      typeof existing === 'object' &&
      existing !== null &&
      !('$value' in existing)
    ) {
      target[key] = deepMerge(
        { ...(existing as DtcgGroup) },
        value as DtcgGroup,
      );
    } else {
      target[key] = value;
    }
  }
  return target;
};

/**
 * Builds the model every output reads from. Sources are validated first; any
 * error throws with every problem listed.
 */
export const createTokenModel = (
  sources: SourceFile[] = loadTokenSources(),
): TokenModel => {
  const { errors, warnings } = validateSources(sources);
  if (errors.length) throw new TokenValidationError(errors);

  const collections: Collection[] = [];
  for (const source of sources) {
    let collection = collections.find(({ name }) => name === source.collection);
    if (!collection) {
      collection = { name: source.collection, order: source.order, modes: [] };
      collections.push(collection);
    }
    if (source.mode !== null) collection.modes.push(source.mode);
  }

  const collectionOf = (name: string): Collection => {
    const collection = collections.find((c) => c.name === name);
    if (!collection) throw new Error(`Unknown token collection "${name}"`);
    return collection;
  };

  // Targets resolve thousands of tokens against the same selection of files.
  const idsByFiles = new WeakMap<SourceFile[], Map<string, Token>>();

  const tokensOf = (files: SourceFile[]): Token[] => {
    const byId = new Map<string, Token>();
    for (const file of files) {
      for (const token of flattenTokens(file)) byId.set(token.id, token);
    }
    return [...byId.values()];
  };

  return {
    sources,
    collections,
    warnings,
    modesOf: (name) => collectionOf(name).modes,
    select: (include, selection = {}) =>
      include.flatMap((name) => {
        const collection = collectionOf(name);
        const files = sources.filter((source) => source.collection === name);
        // A single file is the whole collection, whatever its mode is called
        // (`1.primitives.value`).
        if (files.length === 1) return files;
        const mode = selection[name];
        const file = files.find((source) => source.mode === mode);
        if (!file) {
          throw new Error(
            `Collection "${name}" needs a mode (one of ${collection.modes.join(', ')}), got "${mode}"`,
          );
        }
        return [file];
      }),
    tokens: tokensOf,
    resolve: (token, files) => {
      let byId = idsByFiles.get(files);
      if (!byId) {
        byId = new Map(tokensOf(files).map((t) => [t.id, t]));
        idsByFiles.set(files, byId);
      }
      const lookup = byId;
      // Validation rejected cycles before the model existed, so this ends.
      const follow = (value: unknown): unknown => {
        const reference = referenceOf(value);
        if (reference) {
          const next = lookup.get(reference);
          if (!next) {
            throw new Error(
              `${token.source.file}: ${token.id}: {${reference}} is not in ${files.map((f) => f.file).join(', ')}`,
            );
          }
          return follow(next.$value);
        }
        if (Array.isArray(value)) return value.map(follow);
        if (value !== null && typeof value === 'object') {
          return Object.fromEntries(
            Object.entries(value).map(([key, nested]) => [key, follow(nested)]),
          );
        }
        return value;
      };
      return follow(token.$value) as DtcgValue;
    },
    tree: (files) =>
      files.reduce<DtcgGroup>(
        (merged, file) => deepMerge(merged, tagTokens(file.tokens, file)),
        {},
      ),
  };
};
