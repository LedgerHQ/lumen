import { TypographyTokens } from '../types';
import { typographyMdTokens } from './typography.md';

export const typographyLgTokens = {
  ...typographyMdTokens,
} as const satisfies TypographyTokens;
