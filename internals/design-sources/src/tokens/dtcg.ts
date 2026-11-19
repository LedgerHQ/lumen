/**
 * The DTCG 2025.10 subset Lumen's sources use: colors as sRGB objects,
 * dimensions and durations as objects with an explicit unit. Shadows and
 * gradients only come from `tokens/code/`: Figma variables can't hold them.
 */
export type DtcgType =
  | 'color'
  | 'dimension'
  | 'number'
  | 'duration'
  | 'cubicBezier'
  | 'fontFamily'
  | 'fontWeight'
  | 'shadow'
  | 'gradient';

export type DtcgDimension = { value: number; unit: 'px' | '%' };
export type DtcgDuration = { value: number; unit: 'ms' };
export type DtcgCubicBezier = [number, number, number, number];
export type DtcgColor = {
  colorSpace: 'srgb';
  components: [number, number, number];
  alpha?: number;
  /** 6-digit fallback for tools without color-space support. */
  hex: string;
};

/** A color value, or a `{reference}` to one, as composite tokens hold them. */
export type DtcgColorValue = DtcgColor | string;

export type DtcgShadowLayer = {
  color: DtcgColorValue;
  offsetX: DtcgDimension | string;
  offsetY: DtcgDimension | string;
  blur: DtcgDimension | string;
  spread: DtcgDimension | string;
};

export type DtcgGradientStop = { color: DtcgColorValue; position: number };

export type DtcgValue =
  | string
  | number
  | DtcgColor
  | DtcgDimension
  | DtcgDuration
  | DtcgCubicBezier
  | DtcgShadowLayer
  | DtcgShadowLayer[]
  | DtcgGradientStop[];

/**
 * What the export keeps from Figma. Not the code syntax: design-build writes it
 * and sync-figma uploads it, so copying it back would change the sources on
 * every sync.
 */
export type FigmaExtensions = {
  hiddenFromPublishing?: boolean;
  scopes?: string[];
};

export type DtcgToken = {
  $type: DtcgType;
  $value: DtcgValue;
  $description?: string;
  $extensions?: Record<string, unknown> & { 'com.figma'?: FigmaExtensions };
};

export type DtcgGroup = {
  [key: string]: DtcgToken | DtcgGroup | DtcgType | string | undefined;
  $type?: DtcgType;
  $description?: string;
};

export const DTCG_TYPES: ReadonlySet<string> = new Set<DtcgType>([
  'color',
  'dimension',
  'number',
  'duration',
  'cubicBezier',
  'fontFamily',
  'fontWeight',
  'shadow',
  'gradient',
]);

export const isToken = (node: unknown): node is DtcgToken =>
  typeof node === 'object' && node !== null && '$value' in node;

/** `{font.size.64}` → `font.size.64`, or `null` for a concrete value. */
export const referenceOf = (value: unknown): string | null =>
  typeof value === 'string' && /^\{[^{}]+\}$/.test(value)
    ? value.slice(1, -1)
    : null;
