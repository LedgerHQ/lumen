import type { TypographyTokens } from '../types.js';
import { typographyMdTokens } from './typography.md.js';

export const typographyLgTokens = {
  ...typographyMdTokens,
} as const satisfies TypographyTokens;
