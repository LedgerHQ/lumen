import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Feather icon component for React Native.
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
 * import { Feather } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Feather />
 *
 * @example
 * // With custom size and style
 * <Feather size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Feather} size="md">
 *   Click me
 * </Button>
 */
export const Feather = createIcon(
  'Feather',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m8.666 7.334-6 6m7.871-2.08a9.6 9.6 0 0 0 2.673-7.161 1.36 1.36 0 0 0-1.303-1.303 9.6 9.6 0 0 0-7.162 2.673c-1.92 1.921-2.182 4.775-.582 6.374 1.6 1.6 4.453 1.339 6.374-.582'
    />
  </Svg>,
);
