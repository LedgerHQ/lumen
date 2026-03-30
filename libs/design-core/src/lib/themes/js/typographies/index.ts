import { TypographyTokensByBreakpoint } from '../types';
import { typographyLgTokens } from './typography.lg';
import { typographyMdTokens } from './typography.md';
import { typographySmTokens } from './typography.sm';
import { typographyXlTokens } from './typography.xl';
import { typographyXsTokens } from './typography.xs';

export const typographyTokens = {
  xs: typographyXsTokens,
  sm: typographySmTokens,
  md: typographyMdTokens,
  lg: typographyLgTokens,
  xl: typographyXlTokens,
} satisfies TypographyTokensByBreakpoint;
