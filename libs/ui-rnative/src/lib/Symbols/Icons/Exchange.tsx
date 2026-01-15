import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Exchange icon component for React Native.
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
 * import { Exchange } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Exchange />
 *
 * @example
 * // With custom size and style
 * <Exchange size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Exchange} size="md">
 *   Click me
 * </Button>
 */
export const Exchange = createIcon(
  'Exchange',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8.667 12.667h-2a3.334 3.334 0 0 1-3.334-3.334v-6m0 0L5 5M3.333 3.333 1.667 5m5.657-1.667h2a3.334 3.334 0 0 1 3.333 3.334v6m0 0L10.99 11m1.667 1.667L14.324 11'
    />
  </Svg>,
);
