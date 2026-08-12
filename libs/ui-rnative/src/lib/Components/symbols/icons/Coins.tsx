import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Coins icon component for React Native.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props (from react-native-svg)
 * and additional size variants defined in the Icon component.
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [color] - The color of the icon.
 * @param {SVGProps} [...props] - All standard SVG element props (from react-native-svg).
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Coins } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Coins />
 *
 * @example
 * // With custom size and style
 * <Coins size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Coins} size="md">
 *   Click me
 * </Button>
 */
export const Coins = createIcon(
  'Coins',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2 6c0 .733 1.487 1.333 3.333 1.333m0 2.667C3.493 10 2 9.4 2 8.667m6.66-5.334v2m-1.327 5.334C7.333 11.4 8.82 12 10.667 12c1.84 0 3.333-.6 3.333-1.333M7.333 8c0 .733 1.487 1.333 3.334 1.333C12.507 9.333 14 8.733 14 8v5.333c0 .734-1.493 1.334-3.333 1.334-1.847 0-3.334-.6-3.334-1.334zm0 0c0-.74 1.494-1.333 3.334-1.333S14 7.26 13.993 8m-8.66 4.667c-1.84 0-3.333-.6-3.333-1.334v-8m0 0c0-.353.351-.692.976-.942S4.45 2 5.333 2s1.732.14 2.357.39.977.59.977.943c0 .354-.352.693-.977.943s-1.473.39-2.357.39-1.732-.14-2.357-.39S2 3.687 2 3.333'
    />
  </Svg>,
);
