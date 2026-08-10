import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Circles icon component for React Native.
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
 * import { Circles } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Circles />
 *
 * @example
 * // With custom size and style
 * <Circles size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Circles} size="md">
 *   Click me
 * </Button>
 */
export const Circles = createIcon(
  'Circles',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.333 2.511a6 6 0 0 0-6.666 0m5.986 10.369a6 6 0 0 0 3.334-5.773m-8.64 5.773a6 6 0 0 1-3.334-5.773m11.89-3.315a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414m-10.388 0a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414m5.194 9a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414M9.65 5.85a2.333 2.333 0 1 1-3.3 3.3 2.333 2.333 0 0 1 3.3-3.3'
    />
  </Svg>,
);
