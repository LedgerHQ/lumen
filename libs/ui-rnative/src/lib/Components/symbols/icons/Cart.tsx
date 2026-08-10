import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Cart icon component for React Native.
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
 * import { Cart } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Cart />
 *
 * @example
 * // With custom size and style
 * <Cart size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Cart} size="md">
 *   Click me
 * </Button>
 */
export const Cart = createIcon(
  'Cart',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m5.333 11.667-2-9.334H2m3.5 9.334h6.667m-6.667 0A1.167 1.167 0 1 0 5.5 14a1.167 1.167 0 0 0 0-2.333m6.667 0a1.167 1.167 0 1 0 0 2.333 1.167 1.167 0 0 0 0-2.333M3.76 4.333h9.567a.66.66 0 0 1 .666.66.7.7 0 0 1-.026.167l-1.067 4a.68.68 0 0 1-.647.493H4.887'
    />
  </Svg>,
);
