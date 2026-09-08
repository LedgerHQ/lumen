export { DotIcon, dotIconSizeMap } from './DotIcon';
export * from './getDotIconProps';
export * from './types';

// shim: @ledgerhq/crypto-icons imports this
// remove once the package drops the dependency
export const mediaImageDotIconSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  64: 24,
  72: 32,
} as const;
