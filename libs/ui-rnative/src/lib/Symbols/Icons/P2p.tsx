import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * P2p icon component for React Native.
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
 * import { P2p } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <P2p />
 *
 * @example
 * // With custom size and style
 * <P2p size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={P2p} size="md">
 *   Click me
 * </Button>
 */
export const P2p = createIcon(
  'P2p',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M14.002 10v-.666a1.965 1.965 0 0 0-2-2h-1.334M8 10v-.667a1.965 1.965 0 0 0-2-2H3.997a1.965 1.965 0 0 0-2 2V10m10.004 3.404v-1.704h-1.73m-6.274 0a4.412 4.412 0 0 0 7.75 0M6.665 3.665a1.667 1.667 0 1 1-3.335 0 1.667 1.667 0 0 1 3.335 0m6.002.333a1.334 1.334 0 1 1-2.667 0 1.334 1.334 0 0 1 2.668 0'
    />
  </Svg>,
);
