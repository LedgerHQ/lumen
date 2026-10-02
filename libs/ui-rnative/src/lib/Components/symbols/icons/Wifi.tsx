import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Wifi icon component for React Native.
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
 * import { Wifi } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Wifi />
 *
 * @example
 * // With custom size and style
 * <Wifi size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Wifi} size="md">
 *   Click me
 * </Button>
 */
export const Wifi = createIcon(
  'Wifi',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M7.999 12.333a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.06 8c2.729-2.502 7.15-2.502 9.879 0M1.063 5.203c3.831-3.382 10.043-3.382 13.874 0m-9.884 5.344a4.184 4.184 0 0 1 5.894 0'
    />
  </Svg>,
);
