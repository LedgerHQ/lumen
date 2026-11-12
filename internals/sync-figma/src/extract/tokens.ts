import type {
  GetLocalVariablesResponse,
  LocalVariable,
  LocalVariableCollection,
} from '@figma/rest-api-spec';
import type { DtcgGroup, DtcgToken, DtcgType } from '@lumen/design-sources';
import {
  aliasReference,
  dtcgTypeOf,
  dtcgValueOf,
  UnsupportedVariableError,
} from './dtcg.js';

type Mode = { modeId: string; name: string };

/** `Ledger Live` → `ledger-live`: the form design-sources reads file names in. */
const fileNamePart = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * `4.Breakpoint` × `XL - 1024 & more` → `4.breakpoint.xl.tokens.json`. A
 * collection with a single mode left at Figma's default name (`Mode 1`) has no
 * mode in its file name.
 */
export const tokenFileName = (
  collection: Pick<LocalVariableCollection, 'name' | 'modes'>,
  mode: Mode,
): string => {
  const collectionName = fileNamePart(collection.name);
  if (collection.modes.length === 1 && /^mode\s*1$/i.test(mode.name.trim())) {
    return `${collectionName}.tokens.json`;
  }
  return `${collectionName}.${fileNamePart(mode.name.split(' - ')[0])}.tokens.json`;
};

type AliasValue = { type: 'VARIABLE_ALIAS'; id: string };

const isAlias = (value: unknown): value is AliasValue =>
  typeof value === 'object' &&
  value !== null &&
  (value as AliasValue).type === 'VARIABLE_ALIAS';

/**
 * An alias takes the type of the variable it ends on, so `font-style/…/size`
 * (an alias to `font/size/64`) is a `dimension` like its target.
 */
const resolveType = (
  variable: LocalVariable,
  modeId: string,
  variables: Record<string, LocalVariable>,
  seen = new Set<string>(),
): DtcgType | null => {
  if (seen.has(variable.id)) {
    throw new UnsupportedVariableError(`${variable.name}: circular alias`);
  }
  seen.add(variable.id);

  const value =
    variable.valuesByMode[modeId] ?? Object.values(variable.valuesByMode)[0];
  if (isAlias(value)) {
    const target = variables[value.id];
    if (!target) {
      throw new UnsupportedVariableError(
        `${variable.name}: alias to unknown variable ${value.id}`,
      );
    }
    return resolveType(target, modeId, variables, seen);
  }

  return dtcgTypeOf({
    name: variable.name,
    resolvedType: variable.resolvedType,
    scopes: variable.scopes,
    value,
  });
};

const setPath = (root: DtcgGroup, path: string[], token: DtcgToken): void => {
  let group = root;
  for (const key of path.slice(0, -1)) {
    group[key] ??= {};
    group = group[key] as DtcgGroup;
  }
  group[path[path.length - 1]] = token;
};

export type ExtractedTokens = Record<string, DtcgGroup>;

/**
 * Turns `GET /variables/local` into one DTCG file per collection × mode.
 * Throws on any variable without a DTCG mapping, listing all of them.
 */
export const extractTokenFiles = (
  response: GetLocalVariablesResponse,
  fileName: typeof tokenFileName = tokenFileName,
): ExtractedTokens => {
  const { variables, variableCollections } = response.meta;
  const files: ExtractedTokens = {};
  const errors: string[] = [];

  for (const variable of Object.values(variables)) {
    // A variable deleted in Figma lives on while something still aliases it;
    // exporting it would hide the deletion. The dangling alias then fails
    // validation in design-sources.
    if (variable.remote || variable.deletedButReferenced) continue;
    const collection = variableCollections[variable.variableCollectionId];

    for (const mode of collection.modes) {
      let type: DtcgType | null;
      try {
        type = resolveType(variable, mode.modeId, variables);
      } catch (error) {
        if (!(error instanceof UnsupportedVariableError)) throw error;
        errors.push(error.message);
        break;
      }
      if (type === null) break;

      const raw = variable.valuesByMode[mode.modeId];
      const $value = isAlias(raw)
        ? aliasReference(variables[raw.id].name)
        : dtcgValueOf(type, {
            name: variable.name,
            resolvedType: variable.resolvedType,
            scopes: variable.scopes,
            value: raw,
          });

      const file = fileName(collection, mode);
      files[file] ??= {};
      setPath(files[file], variable.name.split('/'), {
        $type: type,
        $value,
        $description: variable.description,
        $extensions: {
          'com.figma': {
            hiddenFromPublishing: variable.hiddenFromPublishing,
            scopes: variable.scopes,
            codeSyntax: variable.codeSyntax,
          },
        },
      });
    }
  }

  if (errors.length) {
    throw new UnsupportedVariableError(
      `The Figma export has variables with no DTCG mapping:\n- ${errors.join('\n- ')}`,
    );
  }
  return files;
};
