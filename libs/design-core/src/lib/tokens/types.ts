import type {
  BreakpointKey,
  ShadowKey,
  TypographyStyleKey,
} from '../generated/js/keys.js';

/**
 * Color primitives
 */
export type PrimitiveColorTokens = {
  light: {
    constant: Record<string, string>;
    grey: Record<string, string>;
    orange: Record<string, string>;
    purple: Record<string, string>;
    blue: Record<string, string>;
    green: Record<string, string>;
    yellow: Record<string, string>;
    red: Record<string, string>;
    crypto: Record<string, string>;
    cryptoTransparent: Record<string, string>;
    discover: Record<string, string>;
    decorative: Record<string, Record<string, string>>;
  };
  dark: {
    constant: Record<string, string>;
    grey: Record<string, string>;
    purple: Record<string, string>;
    orange: Record<string, string>;
    blue: Record<string, string>;
    green: Record<string, string>;
    yellow: Record<string, string>;
    red: Record<string, string>;
    crypto: Record<string, string>;
    cryptoTransparent: Record<string, string>;
    discover: Record<string, string>;
    decorative: Record<string, Record<string, string>>;
  };
};

export type PrimitiveGradientTokens = {
  light: {
    crypto: Record<string, { color: string }[]>;
  };
  dark: {
    crypto: Record<string, { color: string }[]>;
  };
};

/**
 * Typography primitives
 */
export type PrimitiveTypographyTokens = {
  fontFamily: Record<string, string>;
  fontWeight: Record<string, string>;
  fontSize: Record<string, number>;
  lineHeight: Record<string, number>;
  letterSpacing: Record<string, number>;
};

/**
 * Motion primitives
 */
export type PrimitiveMotionTokens = {
  durations: Record<string, number>;
  delays: Record<string, number>;
  easings: Record<string, readonly [number, number, number, number]>;
};

/**
 * Size & Spacing & Other primitives
 */
export type PrimitiveOtherTokens = {
  spacings: Record<string, number>;
  sizes: Record<string, number | '100%'>;
  icon: {
    width: Record<string, number>;
    height: Record<string, number>;
    borderWidth: Record<string, number>;
  };
  spot: {
    width: Record<string, number>;
    height: Record<string, number>;
  };
  spinner: {
    borderWidth: Record<string, number>;
  };
  borderRadius: Record<string, number>;
  stroke: Record<string, number>;
  borderWidth: Record<string, number>;
  blur: Record<string, number>;
  breakpoints: Record<BreakpointKey, number>;
};

export type ShadowTokenDefinition = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadDistance: number;
  color: string;
};

/** Innermost layer first. */
export type PrimitiveShadowTokens = Record<ShadowKey, ShadowTokenDefinition[]>;

export type TypographyDefinition = {
  fontFamily: string;
  fontWeight: any;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export type TypographyTokens = {
  [Group in keyof TypographyStyleKey]: Record<
    TypographyStyleKey[Group],
    TypographyDefinition
  >;
};

/** The base breakpoint is always there; wider ones only where a value changes. */
export type TypographyTokensByBreakpoint = Partial<
  Record<BreakpointKey, TypographyTokens>
> & { sm: TypographyTokens };

export type ThemeColorTokens = {
  gradients: {
    crypto: Record<string, { color: string }[]>;
  };
  border: Record<string, string>;
  bg: Record<string, string>;
  text: Record<string, string>;
  discover: Record<string, string>;
  crypto: Record<string, string>;
};

export type ThemeCoreTokens = PrimitiveOtherTokens & {
  fontFamilies: PrimitiveTypographyTokens['fontFamily'];
  shadows: PrimitiveShadowTokens;
  typographies: TypographyTokensByBreakpoint;
  motion: PrimitiveMotionTokens;
};
