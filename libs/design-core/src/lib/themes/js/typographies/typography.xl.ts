import { TypographyTokens } from '../types';
import { typographyMdTokens } from './typography.md';

export const typographyXlTokens = {
  ...typographyMdTokens,
} as const satisfies TypographyTokens;
