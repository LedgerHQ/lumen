export { DotIcon, dotIconSizeMap } from './DotIcon';
export * from './getDotIconProps';
export * from './types';

// shim: @ledgerhq/crypto-icons imports this which used by our Storybook build...
// remove once that package drops the dependency
export const mediaImageDotSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  64: 24,
  72: 32,
} as const;
