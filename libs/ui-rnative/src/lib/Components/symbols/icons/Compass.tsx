import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Compass icon component for React Native.
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
 * import { Compass } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Compass />
 *
 * @example
 * // With custom size and style
 * <Compass size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Compass} size="md">
 *   Click me
 * </Button>
 */
export const Compass = createIcon(
  'Compass',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M12.243 3.753a6 6 0 0 1 0 8.48 6.007 6.007 0 0 1-8.487 0 5.996 5.996 0 0 1 0-8.486 5.99 5.99 0 0 1 8.48-.001m-2.69 5.787L6.454 6.467m0 .002 4.214-1.142-1.12 4.193-4.214 1.133z'
    />
  </Svg>,
);
