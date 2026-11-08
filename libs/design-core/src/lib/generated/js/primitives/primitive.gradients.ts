import type { PrimitiveGradientTokens } from '../types.js';
import { extractCryptoGradients } from '../utils/extractCryptoGradients.js';

export const primitiveGradientTokens = {
  light: {
    crypto: extractCryptoGradients('light'),
  },
  dark: {
    crypto: extractCryptoGradients('dark'),
  },
} satisfies PrimitiveGradientTokens;
