import type { TypographyTokensByBreakpoint } from '../types.js';
import { typographyLgTokens } from './typography.lg.js';
import { typographyMdTokens } from './typography.md.js';
import { typographySmTokens } from './typography.sm.js';
import { typographyXlTokens } from './typography.xl.js';
import { typographyXsTokens } from './typography.xs.js';

export const typographyTokens = {
  xs: typographyXsTokens,
  sm: typographySmTokens,
  md: typographyMdTokens,
  lg: typographyLgTokens,
  xl: typographyXlTokens,
} satisfies TypographyTokensByBreakpoint;
