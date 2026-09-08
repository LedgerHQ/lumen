export { DotSymbol } from './DotSymbol';
export * from './getDotSymbolProps';
export * from './types';

// shim: @ledgerhq/crypto-icons imports this
// remove once the package drops the dependency
export const mediaImageDotSizeMap = {
  12: 8,
  16: 8,
  20: 8,
  24: 10,
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  64: 24,
  72: 32,
} as const;
