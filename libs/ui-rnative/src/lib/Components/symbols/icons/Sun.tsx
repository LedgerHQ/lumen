import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Sun icon component for React Native.
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
 * import { Sun } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Sun />
 *
 * @example
 * // With custom size and style
 * <Sun size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Sun} size="md">
 *   Click me
 * </Button>
 */
export const Sun = createIcon(
  'Sun',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 2.667V1.333m0 13.334v-1.334m4.24-9.573.473-.473m-9.426 9.426.473-.473M13.333 8h1.334M1.333 8h1.334m9.573 4.24.473.473M3.287 3.287l.473.473m6.597 1.883a3.333 3.333 0 1 1-4.714 4.714 3.333 3.333 0 0 1 4.714-4.714'
    />
  </Svg>,
);
