import { PrimitiveGradientTokens } from '../types';
import { extractCryptoGradients } from '../utils/extractCryptoGradients';

export const primitiveGradientTokens = {
  light: {
    crypto: extractCryptoGradients('light'),
  },
  dark: {
    crypto: extractCryptoGradients('dark'),
  },
} satisfies PrimitiveGradientTokens;
