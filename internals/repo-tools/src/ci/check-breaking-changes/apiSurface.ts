import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import ts from 'typescript';
import { componentProps, type Props } from './utils/componentProps.ts';
import { cssTokens } from './utils/cssTokens.ts';
import {
  optionalPeers,
  readManifest,
  typeEntries,
  servedFiles,
} from './utils/manifest.ts';
import {
  isPlainObject,
  literalValues,
  objectPaths,
} from './utils/typeShapes.ts';

export type { PropInfo } from './utils/componentProps.ts';

export type ApiSurface = {
  /** Entry point (`.`, `./symbols`) → exported names. */
  entries: Record<string, string[]>;
  /** `<entry>#<Component>` → its props, detailed for those the package declares. */
  props: Record<string, Props>;
  /** `<entry>#<export>` → leaf paths of an exported object. */
  paths: Record<string, string[]>;
  /** `<entry>#<Type>` → literal values of an exported type alias. */
  types: Record<string, string[]>;
  /** Subpaths imported as files (`./symbols/apex.svg`, `./tailwind.css`). */
  files: string[];
  /** CSS custom properties declared in the shipped files. */
  tokens: string[];
  peers: Record<string, string>;
  /** Peers marked optional in `peerDependenciesMeta`. */
  optionalPeers: string[];
};

type Shape = { props?: Props; paths?: string[]; values?: string[] };
type Exported = { name: string; shape: Shape };

/** A TypeScript program over the given `.d.ts` files. */
function compile(files: string[]): ts.Program {
  return ts.createProgram(files, {
    noEmit: true,
    skipLibCheck: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  });
}

/** Whether a symbol is declared in the package, not inherited from React or the DOM. */
function declaredUnder(root: string): (symbol: ts.Symbol) => boolean {
  const base = resolve(root) + sep;
  return (symbol) =>
    symbol.declarations?.some((declaration) =>
      resolve(declaration.getSourceFile().fileName).startsWith(base),
    ) ?? false;
}

/** The symbols a `.d.ts` file exports. */
function moduleExports(program: ts.Program, file: string): ts.Symbol[] {
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(file);
  const module = source && checker.getSymbolAtLocation(source);
  return module ? checker.getExportsOfModule(module) : [];
}

/** A type alias's literal values (`Density` → `compact`, `expanded`). */
function typeShape(checker: ts.TypeChecker, symbol: ts.Symbol): Shape {
  const values = literalValues(checker.getDeclaredTypeOfSymbol(symbol));
  return values === null ? {} : { values };
}

/** What a value export exposes: component props, or an object's leaf paths. */
function valueShape(
  checker: ts.TypeChecker,
  name: string,
  symbol: ts.Symbol,
  isOwn: (symbol: ts.Symbol) => boolean,
): Shape {
  const type = checker.getTypeOfSymbol(symbol);
  const props = /^[A-Z]/.test(name)
    ? componentProps(checker, type, isOwn)
    : undefined;
  if (props !== undefined) return { props };
  if (!isPlainObject(type)) return {};
  const paths = objectPaths(checker, type);
  return paths.length > 0 ? { paths } : {};
}

/** What an export exposes, through re-exports: a value's shape or a type's values. */
function shapeOf(
  checker: ts.TypeChecker,
  exported: ts.Symbol,
  isOwn: (symbol: ts.Symbol) => boolean,
): Shape {
  const symbol =
    exported.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(exported)
      : exported;
  if (symbol.flags & ts.SymbolFlags.Value) {
    return valueShape(checker, exported.name, symbol, isOwn);
  }
  return symbol.flags & ts.SymbolFlags.TypeAlias
    ? typeShape(checker, symbol)
    : {};
}

/** Entry point → each export's name and shape. */
function readExports(root: string): Record<string, Exported[]> {
  const entries = Object.entries(typeEntries(root)).filter(([, file]) =>
    existsSync(file),
  );
  const program = compile(entries.map(([, file]) => file));
  const checker = program.getTypeChecker();
  const isOwn = declaredUnder(root);
  return Object.fromEntries(
    entries.map(([entry, file]) => [
      entry,
      moduleExports(program, file).map((symbol) => ({
        name: symbol.name,
        shape: shapeOf(checker, symbol, isOwn),
      })),
    ]),
  );
}

/** `<entry>#<export>` → one part of each export's shape. */
function byKey<T>(
  exports: Record<string, Exported[]>,
  pick: (shape: Shape) => T | undefined,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(exports).flatMap(([entry, list]) =>
      list.flatMap(({ name, shape }) => {
        const value = pick(shape);
        return value === undefined ? [] : [[`${entry}#${name}`, value]];
      }),
    ),
  );
}

/**
 * The public API of an unpacked package, as consumers see it. Read from the
 * shipped `.d.ts`, not the source, so it covers exactly what was published.
 */
export function readSurface(root: string): ApiSurface {
  const exports = readExports(root);
  return {
    entries: Object.fromEntries(
      Object.entries(exports).map(([entry, list]) => [
        entry,
        list.map(({ name }) => name).sort(),
      ]),
    ),
    props: byKey(exports, (shape) => shape.props),
    paths: byKey(exports, (shape) => shape.paths),
    types: byKey(exports, (shape) => shape.values),
    files: servedFiles(root),
    tokens: cssTokens(root),
    peers: readManifest(root).peerDependencies ?? {},
    optionalPeers: optionalPeers(root),
  };
}
