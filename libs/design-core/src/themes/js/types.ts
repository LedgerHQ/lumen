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
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
};

export type ShadowTokenDefinition = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadDistance: number;
  color: string;
};

export type PrimitiveShadowTokens = {
  sm: [ShadowTokenDefinition, ShadowTokenDefinition];
  md: [ShadowTokenDefinition, ShadowTokenDefinition];
  lg: [ShadowTokenDefinition, ShadowTokenDefinition];
  xl: [ShadowTokenDefinition, ShadowTokenDefinition];
  '2xl': [ShadowTokenDefinition];
};

export type TypographyDefinition = {
  fontFamily: string;
  fontWeight: any;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export type TypographyTokens = {
  responsive: {
    /**
     * responsive display
     */
    responsiveDisplay1: TypographyDefinition;
    responsiveDisplay2: TypographyDefinition;
    responsiveDisplay3: TypographyDefinition;
    responsiveDisplay4: TypographyDefinition;
  };
  heading: {
    /**
     * headings
     */
    heading0: TypographyDefinition;
    heading0SemiBold: TypographyDefinition;
    heading1: TypographyDefinition;
    heading1SemiBold: TypographyDefinition;
    heading2: TypographyDefinition;
    heading2SemiBold: TypographyDefinition;
    heading3: TypographyDefinition;
    heading3SemiBold: TypographyDefinition;
    heading4: TypographyDefinition;
    heading4SemiBold: TypographyDefinition;
    heading5: TypographyDefinition;
    heading5SemiBold: TypographyDefinition;
  };
  body: {
    /**
     * body
     */
    body1: TypographyDefinition;
    body1SemiBold: TypographyDefinition;
    body2: TypographyDefinition;
    body2SemiBold: TypographyDefinition;
    body3: TypographyDefinition;
    body3SemiBold: TypographyDefinition;
    body4: TypographyDefinition;
    body4SemiBold: TypographyDefinition;
  };
};

export type TypographyTokensByBreakpoint = {
  xs?: TypographyTokens;
  sm: TypographyTokens;
  md?: TypographyTokens;
  lg?: TypographyTokens;
  xl?: TypographyTokens;
};

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
  shadows: PrimitiveShadowTokens;
  typographies: TypographyTokensByBreakpoint;
};
