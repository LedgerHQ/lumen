import {
  colorToHex,
  type DtcgDimension,
  type DtcgShadowLayer,
  type SourceFile,
  type Token,
  type TokenModel,
} from '@lumen/design-sources';
import type { OutputFile, Target } from '../core/target.js';
import { breakpointLayers, layerTokens, themeLayers } from './layers.js';
import {
  camelKey,
  cssVariableName,
  outputSegment,
  semanticKey,
  stepKey,
} from './naming.js';
import { REACT_NATIVE_PENDING_DECISIONS } from './pendingDecisions.js';
import { coreFiles, orderedBreakpoints } from './selections.js';

type Json = string | number | boolean | Json[] | { [key: string]: Json };
type JsonObject = Record<string, Json>;

/**
 * Theme color groups React Native reads, keyed by the CSS variable prefix of
 * the semantic layer: `--background-canvas-muted` → `bg.canvasMuted`.
 */
const COLOR_GROUPS: [prefix: string, group: string][] = [
  ['--background-', 'bg'],
  ['--text-', 'text'],
  ['--border-', 'border'],
  ['--color-crypto-', 'crypto'],
  ['--color-discover-', 'discover'],
];

/** Figma group → where the React Native theme puts it. */
const LAYOUT_GROUPS: [figmaGroup: string, jsPath: string[]][] = [
  ['spacing', ['spacings']],
  ['icon-width', ['icon', 'width']],
  ['icon-height', ['icon', 'height']],
  ['icon-border-width', ['icon', 'borderWidth']],
  ['spot-width', ['spot', 'width']],
  ['spot-height', ['spot', 'height']],
  ['spinner-border-width', ['spinner', 'borderWidth']],
  ['size', ['sizes']],
  ['border-radius', ['borderRadius']],
  ['stroke', ['stroke']],
  ['border-width', ['borderWidth']],
  ['backdrop-blur', ['blur']],
  ['screen', ['breakpoints']],
];

/**
 * CSS tokens React Native deliberately doesn't read. Anything else the CSS
 * output builds must land in the theme, or the build fails: a new Figma group
 * can't reach the web and silently skip mobile.
 */
const WEB_ONLY: { matches: (name: string) => boolean; reason: string }[] = [
  {
    matches: (name) => /^--color-(background|text|border)-/.test(name),
    reason:
      'the theme layer; React Native reads the brand layer that aliases it',
  },
  {
    matches: (name) => name.startsWith('--border-width'),
    reason: 'Tailwind border defaults; React Native has borderWidth steps',
  },
  {
    matches: (name) => name.startsWith('--font-style-heading-3-size-2'),
    reason: 'a duplicate Figma variable (`size 2`), flagged by validation',
  },
];

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

const getPath = (root: JsonObject, path: string[]): Json | undefined =>
  path.reduce<Json | undefined>(
    (node, key) =>
      node && typeof node === 'object'
        ? (node as Record<string, Json>)[key]
        : undefined,
    root,
  );

const applyPendingDecisions = (theme: JsonObject): JsonObject => {
  for (const { path, value } of REACT_NATIVE_PENDING_DECISIONS) {
    if (getPath(theme, path) === undefined) {
      throw new Error(`Pending decision on ${path.join('.')}: no such JS key`);
    }
    setPath(theme, path, value);
  }
  return theme;
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

const layoutTokens = (
  tokens: Token[],
  resolve: Resolver,
  used: Used,
): JsonObject => {
  const layout: JsonObject = {};
  for (const [figmaGroup, jsPath] of LAYOUT_GROUPS) {
    setPath(layout, jsPath, {});
    for (const token of tokens) {
      if (token.path[0] !== figmaGroup || token.path.length !== 2) continue;
      const key =
        figmaGroup === 'border-radius' || figmaGroup === 'screen'
          ? token.path[1]
          : stepKey(token.path[1]);
      used.set(token, themePath([...jsPath, key]));
      setPath(layout, [...jsPath, key], px(resolve(token)));
    }
  }
  return layout;
};

const motionTokens = (tokens: Token[], resolve: Resolver): JsonObject => {
  const motion: JsonObject = { durations: {}, delays: {}, easings: {} };
  for (const token of tokens) {
    const [group, key] = token.path;
    const value = resolve(token);
    if (group === 'duration') {
      setPath(motion, ['durations', key], (value as { value: number }).value);
    } else if (group === 'delay') {
      setPath(motion, ['delays', key], (value as { value: number }).value);
    } else if (group === 'easing') {
      setPath(motion, ['easings', camelKey(key)], value as number[]);
    }
  }
  return motion;
};

const shadowTokens = (tokens: Token[], resolve: Resolver): JsonObject => {
  const shadows: JsonObject = {};
  for (const token of tokens) {
    if (token.path[0] !== 'shadow' || token.$type !== 'shadow') continue;
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

  for (const token of tokens) {
    const [root, group, step, property] = token.path;
    if (root !== 'font-style' || property !== 'size') continue;
    const base = `font-style.${group}.${step}`;
    const name = `${camelKey(group)}${step}`;
    const jsGroup = group === 'responsive-display' ? 'responsive' : group;
    const variants: [string, string][] =
      jsGroup === 'responsive'
        ? [[name, `${base}.weight`]]
        : [
            [name, `${base}.weight-medium`],
            [`${name}SemiBold`, `${base}.weight-semi-bold`],
          ];

    for (const [key, weight] of variants) {
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
  const colors: JsonObject = {
    crypto: {},
    discover: {},
    bg: {},
    text: {},
    border: {},
  };
  for (const token of tokens) {
    if (token.$type !== 'color') continue;
    const name = cssVariableName(token.path);
    const match = COLOR_GROUPS.find(([prefix]) => name.startsWith(prefix));
    if (!match) continue;
    const [prefix, group] = match;
    const key = semanticKey(name.slice(prefix.length));
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
 * Fails when a token the CSS output builds is neither in the theme nor listed
 * as web-only, naming them.
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
    ...model.tokens(model.select(['primitives'])),
    ...[...themeLayers(model), ...breakpointLayers(model, breakpoints)].flatMap(
      (layer) => layerTokens(model, layer),
    ),
  ];
  // Typography primitives (`font.*`) reach React Native through the
  // breakpoint styles that reference them.
  const unmapped = built.filter(
    (token) =>
      token.path[0] !== 'font' &&
      !usedIds.has(`${token.source.collection}:${token.id}`) &&
      !WEB_ONLY.some(({ matches }) => matches(cssVariableName(token.path))),
  );
  const names = [
    ...new Set(unmapped.map((token) => cssVariableName(token.path))),
  ];
  if (names.length) {
    throw new Error(
      `The CSS output builds tokens the React Native theme doesn't read: ${names.slice(0, 10).join(', ')}${names.length > 10 ? ', …' : ''}. Map them in js.ts, or list them in WEB_ONLY with the reason.`,
    );
  }
};

const literal = (value: Json): string => JSON.stringify(value, null, 2);

/**
 * Motion types `ui-rnative` relies on: durations and delays keyed by number
 * (`durations[300]`, JSON would quote the keys), and easings typed as plain
 * 4-number tuples, so `Easing.bezier(...easings[name])` accepts any of them.
 */
const motionTypes = (source: string): string =>
  source
    .replace(/"(?:durations|delays)": \{[^}]*\}/g, (block) =>
      block.replace(/"(\d+)":/g, '$1:'),
    )
    .replace(/"easings": \{[^}]*\}/, (block) =>
      block.replace(
        /(\[[^\]]*\])/g,
        '$1 as readonly [number, number, number, number]',
      ),
    );

/** A brand's colors, pointing at the shared gradients instead of repeating them. */
const colorsLiteral = (colors: JsonObject, mode: string): string => {
  const { gradients: _gradients, ...semantic } = colors;
  return literal(semantic).replace(
    /\n\}$/,
    `,\n  "gradients": { "crypto": primitiveGradientTokens.${mode}.crypto }\n}`,
  );
};

const HEADER = `/**
 * Do not edit directly, this file was auto-generated by design-build.
 */
`;

const TYPES_IMPORT = '../../tokens/types.js';

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

  const core = applyPendingDecisions({
    ...layoutTokens(tokens, resolveCore, used),
    fontFamilies: { sans: fontFamily },
    shadows: shadowTokens(tokens, resolveCore),
    typographies,
    motion: motionTokens(tokens, resolveCore),
  });

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
 * tokens), and the barrel. Values are resolved literals.
 */
export const jsTarget = (outDir: string): Target<TokenModel> => ({
  name: 'js',
  outDir,
  emit: (model) => {
    const theme = jsTheme(model);
    const brands = Object.keys(theme.colors);

    const files: OutputFile[] = [
      {
        path: 'primitives.ts',
        contents: `${HEADER}
import type { PrimitiveColorTokens, PrimitiveGradientTokens, ThemeCoreTokens } from '${TYPES_IMPORT}';

export const primitiveColorTokens = ${literal(theme.primitiveColors)} as const satisfies PrimitiveColorTokens;

export const primitiveGradientTokens = ${literal(theme.gradients)} as const satisfies PrimitiveGradientTokens;

export const coreTokens = ${motionTypes(literal(theme.core))} as const satisfies ThemeCoreTokens;
`,
      },
    ];

    for (const brand of brands) {
      const name = camelKey(brand);
      const Name = `${name[0].toUpperCase()}${name.slice(1)}`;

      files.push({
        path: `${brand}.ts`,
        contents: `${HEADER}
import type { ThemeColorTokens } from '${TYPES_IMPORT}';
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
} from '${TYPES_IMPORT}';
`,
    });

    return files;
  },
});
