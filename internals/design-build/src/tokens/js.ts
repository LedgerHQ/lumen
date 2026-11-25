import {
  type DtcgDimension,
  type DtcgShadowLayer,
  type SourceFile,
  type Token,
  type TokenModel,
} from '@lumen/design-sources';
import type { OutputFile, Target } from '../core/target.js';
import { colorToHex } from './cssLayers.js';
import { GROUPS, groupOf, parseGroupKey } from './groups.js';
import {
  breakpointLayers,
  layerTokens,
  themeLayers,
  coreFiles,
  orderedBreakpoints,
} from './modes.js';
import {
  camelKey,
  cssVariableName,
  outputSegment,
  semanticKey,
  stepKey,
  typographyStyles,
} from './naming.js';

type Json = string | number | boolean | Json[] | { [key: string]: Json };
type JsonObject = Record<string, Json>;

const px = (value: unknown): number | string => {
  const { value: amount, unit } = value as DtcgDimension;
  return unit === '%' ? `${amount}%` : amount;
};

const setPath = (root: JsonObject, path: string[], value: Json): void => {
  let node = root;
  for (const key of path.slice(0, -1)) {
    node[key] ??= {};
    node = node[key] as JsonObject;
  }
  node[path[path.length - 1]] = value;
};

type Resolver = (token: Token) => unknown;

/**
 * Every source token the theme reads, with its `t.*` path in `ui-rnative` when
 * it has one: for the completeness check and for Dev Mode code syntax.
 */
type Used = Map<Token, string | null>;

/** `['icon', 'width', 's16']` → `t.icon.width.s16`, `['borderRadius', '2xl']` → `t.borderRadius['2xl']`. */
const themePath = (path: string[]): string =>
  `t${path.map((key) => (/^[a-z_$][\w$]*$/i.test(key) ? `.${key}` : `['${key}']`)).join('')}`;

const resolverFor =
  (model: TokenModel, files: SourceFile[]): Resolver =>
  (token) =>
    model.resolve(token, files);

const primitiveColors = (
  tokens: Token[],
  resolve: Resolver,
  used: Used,
): JsonObject => {
  const colors: JsonObject = {};
  for (const token of tokens) {
    const [root, mode, group, ...rest] = token.path;
    if (root !== 'color' || rest.length === 0) continue;
    // Primitive colors aren't on `t`: components read the semantic ones.
    used.set(token, null);
    const value = colorToHex(resolve(token));
    const leaf = outputSegment(rest[rest.length - 1]);

    if (group === 'crypto' && leaf.endsWith('-0')) {
      setPath(
        colors,
        [mode, 'cryptoTransparent', camelKey(leaf.slice(0, -2))],
        value,
      );
    } else {
      setPath(
        colors,
        [mode, group, ...rest.slice(0, -1), camelKey(leaf)],
        value,
      );
    }
  }
  return colors;
};

/** Theme paths a dedicated function builds; every other row is a flat scale of steps. */
const BUILT_BY_FUNCTION = new Set([
  'primitiveColors',
  'colors',
  'shadows',
  'fontFamilies',
  'typographies',
  'motion',
]);

const layoutTokens = (
  tokens: Token[],
  resolve: Resolver,
  used: Used,
): JsonObject => {
  const layout: JsonObject = {};
  for (const [row, group] of Object.entries(GROUPS)) {
    if (!group.reactNative) continue;
    const jsPath = group.reactNative.split('.');
    if (BUILT_BY_FUNCTION.has(jsPath[0])) continue;
    setPath(layout, jsPath, {});
    for (const token of tokens) {
      if (token.path.length !== 2 || groupOf(token).key !== row) continue;
      const step = stepKey(token.path[1]);
      used.set(token, themePath([...jsPath, step]));
      setPath(layout, [...jsPath, step], px(resolve(token)));
    }
  }
  return layout;
};

const motionTokens = (tokens: Token[], resolve: Resolver): JsonObject => {
  const motion: JsonObject = {};
  const rows = Object.values(GROUPS).flatMap(({ reactNative }) =>
    reactNative?.startsWith('motion.') ? [reactNative.split('.')[1]] : [],
  );
  for (const row of rows) motion[row] = {};
  for (const token of tokens) {
    const jsPath = GROUPS[token.path[0]]?.reactNative?.split('.');
    if (jsPath?.[0] !== 'motion') continue;
    const value = resolve(token);
    setPath(
      motion,
      [jsPath[1], camelKey(token.path[1])],
      token.$type === 'duration'
        ? (value as { value: number }).value
        : (value as number[]),
    );
  }
  return motion;
};

const shadowTokens = (
  tokens: Token[],
  resolve: Resolver,
  used: Used,
): JsonObject => {
  const shadows: JsonObject = {};
  for (const token of tokens) {
    if (token.path[0] !== 'shadow' || token.$type !== 'shadow') continue;
    used.set(token, themePath(['shadows', token.path[1]]));
    const layers = resolve(token) as DtcgShadowLayer[];
    shadows[token.path[1]] = layers.map((layer) => ({
      offsetX: px(layer.offsetX),
      offsetY: px(layer.offsetY),
      blurRadius: px(layer.blur),
      spreadDistance: px(layer.spread),
      color: colorToHex(layer.color),
    }));
  }
  return shadows;
};

/** `responsive-display.1` → `responsive.responsiveDisplay1`, `heading.0` (semi-bold) → `heading.heading0SemiBold`. */
const typographyTokens = (
  tokens: Token[],
  resolve: Resolver,
  fontFamily: string,
  used: Used,
): JsonObject => {
  const styles: JsonObject = {};
  const byId = new Map(tokens.map((token) => [token.id, token]));
  // `ui-rnative` flattens heading and body styles onto `t.typographies`.
  const value = (id: string, path: string[] | null): unknown => {
    const token = byId.get(id);
    if (!token) throw new Error(`Missing typography token ${id}`);
    if (!used.get(token)) used.set(token, path ? themePath(path) : null);
    return resolve(token);
  };

  for (const { group, step, weights } of typographyStyles(tokens)) {
    const base = `font-style.${group}.${step}`;
    const name = `${camelKey(group)}${step}`;
    const jsGroup = group === 'responsive-display' ? 'responsive' : group;

    for (const { weight: weightKey, semiBold } of weights) {
      const key = semiBold ? `${name}SemiBold` : name;
      const weight = `${base}.${weightKey}`;
      const at = (property: string): string[] | null =>
        jsGroup === 'responsive' ? null : ['typographies', key, property];
      setPath(styles, [jsGroup, key], {
        fontFamily,
        fontSize: px(value(`${base}.size`, at('fontSize'))),
        fontWeight: String(value(weight, at('fontWeight'))),
        lineHeight: px(value(`${base}.line-height`, at('lineHeight'))),
        letterSpacing: px(value(`${base}.letter-spacing`, at('letterSpacing'))),
      });
    }
  }
  return styles;
};

const semanticColors = (
  tokens: Token[],
  resolve: Resolver,
  used: Used,
): JsonObject => {
  const colors: JsonObject = {};
  for (const { reactNative } of Object.values(GROUPS)) {
    if (reactNative?.startsWith('colors.')) colors[reactNative.slice(7)] = {};
  }
  for (const token of tokens) {
    if (token.$type !== 'color') continue;
    const { key: row, group: match } = groupOf(token);
    if (!match.reactNative?.startsWith('colors.')) continue;
    const group = match.reactNative.slice(7);
    const prefix = `${cssVariableName(parseGroupKey(row).prefix)}-`;
    const key = semanticKey(cssVariableName(token.path).slice(prefix.length));
    used.set(token, themePath(['colors', group, key]));
    setPath(colors, [group, key], colorToHex(resolve(token)));
  }
  return colors;
};

/** Each crypto color fades to its transparent twin, per color mode. */
const cryptoGradients = (primitives: JsonObject): JsonObject =>
  Object.fromEntries(
    Object.entries(primitives).map(([mode, groups]) => {
      const { crypto, cryptoTransparent } = groups as Record<
        string,
        JsonObject
      >;
      return [
        mode,
        {
          crypto: Object.fromEntries(
            Object.keys(crypto).map((key) => [
              key,
              [{ color: crypto[key] }, { color: cryptoTransparent[key] }],
            ]),
          ),
        },
      ];
    }),
  );

/**
 * Fails when a token the CSS output builds has no row in `GROUPS` (via
 * `groupOf`), or belongs to a row meant for React Native that the theme
 * doesn't read: a new Figma group can't reach the web and silently skip mobile.
 */
const assertEveryTokenMapped = (
  model: TokenModel,
  breakpoints: string[],
  used: Used,
): void => {
  const usedIds = new Set(
    [...used.keys()].map((token) => `${token.source.collection}:${token.id}`),
  );
  const built = [
    ...model.tokens(model.select(['primitives', 'shadow'])),
    ...[...themeLayers(model), ...breakpointLayers(model, breakpoints)].flatMap(
      (layer) => layerTokens(model, layer),
    ),
  ];
  const unread = built.filter(
    (token) =>
      !groupOf(token).group.webOnly &&
      !usedIds.has(`${token.source.collection}:${token.id}`),
  );
  const names = [
    ...new Set(unread.map((token) => cssVariableName(token.path))),
  ];
  if (names.length) {
    throw new Error(
      `The React Native theme doesn't read: ${names.slice(0, 10).join(', ')}${names.length > 10 ? ', …' : ''}. Read them in js.ts, or give their group a \`webOnly\` reason in groups.ts.`,
    );
  }
};

/** Written into the module as is: TypeScript that JSON can't express. */
class Code {
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }
}

type Literal = Json | Code | Literal[] | { [key: string]: Literal };

/**
 * A TypeScript literal. Objects open on a new line, so Prettier keeps them
 * expanded, one key per line.
 */
const literal = (value: Literal): string => {
  if (value instanceof Code) return value.text;
  if (Array.isArray(value)) return `[${value.map(literal).join(', ')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, item]) => `${JSON.stringify(key)}: ${literal(item)}`,
    );
    return `{\n${entries.join(',\n')}\n}`;
  }
  return JSON.stringify(value);
};

/**
 * Motion as `ui-rnative` types it: durations and delays keyed by number
 * (`durations[300]`), and easings as plain 4-number tuples, so
 * `Easing.bezier(...easings[name])` accepts any of them.
 */
const motionLiteral = (motion: JsonObject): Literal => {
  const byNumber = (values: Json): Code =>
    new Code(
      `{\n${Object.entries(values as JsonObject)
        .map(([key, value]) => `${key}: ${literal(value)}`)
        .join(',\n')}\n}`,
    );
  return {
    durations: byNumber(motion.durations),
    delays: byNumber(motion.delays),
    easings: Object.fromEntries(
      Object.entries(motion.easings as JsonObject).map(([name, curve]) => [
        name,
        new Code(
          `${literal(curve)} as readonly [number, number, number, number]`,
        ),
      ]),
    ),
  };
};

/** A brand's colors, pointing at the shared gradients instead of repeating them. */
const colorsLiteral = (colors: JsonObject, mode: string): string => {
  const { gradients: _gradients, ...semantic } = colors;
  return literal({
    ...semantic,
    gradients: new Code(`{ crypto: primitiveGradientTokens.${mode}.crypto }`),
  });
};

const HEADER = `/**
 * Do not edit directly, this file was auto-generated by design-build.
 */
`;

export type JsTheme = {
  primitiveColors: JsonObject;
  /** Color mode → crypto gradients, shared by every brand. */
  gradients: JsonObject;
  core: JsonObject;
  /** Brand → color mode → color tokens. */
  colors: Record<string, Record<string, JsonObject>>;
  /** `collection:token.id` → the token's `t.*` path in `ui-rnative`. */
  themePaths: Map<string, string>;
};

/**
 * The React Native theme as data: what the JS target writes, and what the
 * parity test compares with the CSS target.
 */
export const jsTheme = (model: TokenModel): JsTheme => {
  const breakpoints = orderedBreakpoints(model);
  const files = coreFiles(model);
  const tokens = model.tokens(files);
  const resolveCore = resolverFor(model, files);
  const used: Used = new Map();

  const primitiveColorTokens = primitiveColors(tokens, resolveCore, used);
  const fontFamilyToken = tokens.find(({ id }) => id === 'font-family.font');
  if (!fontFamilyToken) throw new Error('Missing font-family.font');
  used.set(fontFamilyToken, themePath(['fontFamilies', 'sans']));
  const fontFamily = String(resolveCore(fontFamilyToken));

  const typographies: JsonObject = {};
  for (const layer of breakpointLayers(model, breakpoints)) {
    typographies[layer.breakpoint] = typographyTokens(
      layerTokens(model, layer),
      resolverFor(model, layer.files),
      fontFamily,
      used,
    );
  }

  const core: JsonObject = {
    ...layoutTokens(tokens, resolveCore, used),
    fontFamilies: { sans: fontFamily },
    shadows: shadowTokens(tokens, resolveCore, used),
    typographies,
    motion: motionTokens(tokens, resolveCore),
  };

  const gradients = cryptoGradients(primitiveColorTokens);
  const colors: JsTheme['colors'] = {};
  for (const layer of themeLayers(model)) {
    const { brand, theme } = layer;
    colors[brand] ??= {};
    colors[brand][theme] = {
      ...semanticColors(
        layerTokens(model, layer),
        resolverFor(model, layer.files),
        used,
      ),
      gradients: (gradients[theme] as JsonObject) ?? {},
    };
  }

  assertEveryTokenMapped(model, breakpoints, used);
  const themePaths = new Map(
    [...used]
      .filter((entry): entry is [Token, string] => entry[1] !== null)
      .map(([token, path]) => [`${token.source.collection}:${token.id}`, path]),
  );
  return {
    primitiveColors: primitiveColorTokens,
    gradients,
    core,
    colors,
    themePaths,
  };
};

/**
 * The React Native theme, in the exact shape `ui-rnative` reads: one module of
 * shared primitives, one per brand (light and dark colors plus the core
 * tokens), and the barrel. Values are resolved literals. `typesImport` is the
 * module, relative to `outDir`, that declares the theme's types.
 */
export const jsTarget = (
  outDir: string,
  typesImport: string,
): Target<TokenModel> => ({
  name: 'js',
  outDir,
  emit: (model) => {
    const theme = jsTheme(model);
    const brands = Object.keys(theme.colors);

    const files: OutputFile[] = [
      {
        path: 'primitives.ts',
        contents: `${HEADER}
import type { PrimitiveColorTokens, PrimitiveGradientTokens, ThemeCoreTokens } from '${typesImport}';

export const primitiveColorTokens = ${literal(theme.primitiveColors)} as const satisfies PrimitiveColorTokens;

export const primitiveGradientTokens = ${literal(theme.gradients)} as const satisfies PrimitiveGradientTokens;

export const coreTokens = ${literal({ ...theme.core, motion: motionLiteral(theme.core.motion as JsonObject) })} as const satisfies ThemeCoreTokens;
`,
      },
    ];

    for (const brand of brands) {
      const name = camelKey(brand);
      const Name = `${name[0].toUpperCase()}${name.slice(1)}`;

      files.push({
        path: `${brand}.ts`,
        contents: `${HEADER}
import type { ThemeColorTokens } from '${typesImport}';
import { coreTokens, primitiveGradientTokens } from './primitives.js';

export const ${name}LightColorTokens = ${colorsLiteral(theme.colors[brand].light, 'light')} as const satisfies ThemeColorTokens;

export const ${name}DarkColorTokens = ${colorsLiteral(theme.colors[brand].dark, 'dark')} as const satisfies ThemeColorTokens;

export { coreTokens as ${name}CoreTokens } from './primitives.js';

const ${name}DarkTheme = { ...coreTokens, colors: ${name}DarkColorTokens };
const ${name}LightTheme = { ...coreTokens, colors: ${name}LightColorTokens };

export const ${name}Themes = {
  dark: ${name}DarkTheme,
  light: ${name}LightTheme,
};

export type ${Name}Themes = typeof ${name}Themes;
export type ${Name}DarkTheme = typeof ${name}DarkTheme;
export type ${Name}LightTheme = typeof ${name}LightTheme;
`,
      });
    }

    // The key sets the hand-written theme types build on, so a new shadow,
    // breakpoint or typography style needs no type edit.
    const union = (keys: string[]): string =>
      keys.map((key) => `'${key}'`).join(' | ');
    const core = theme.core as Record<string, JsonObject>;
    const [baseTypography] = Object.values(core.typographies) as JsonObject[];
    files.push({
      path: 'keys.ts',
      contents: `${HEADER}
export type BreakpointKey = ${union(Object.keys(core.breakpoints))};

export type ShadowKey = ${union(Object.keys(core.shadows))};

export type TypographyStyleKey = {
${Object.entries(baseTypography)
  .map(
    ([group, styles]) =>
      `  ${group}: ${union(Object.keys(styles as JsonObject))};`,
  )
  .join('\n')}
};
`,
    });

    files.push({
      path: 'index.ts',
      contents: `${HEADER}
${brands.map((brand) => `export * from './${brand}.js';`).join('\n')}
export { primitiveColorTokens } from './primitives.js';
export type {
  ThemeCoreTokens,
  ThemeColorTokens,
  TypographyTokens,
  TypographyDefinition,
  ShadowTokenDefinition,
} from '${typesImport}';
`,
    });

    return files;
  },
});
