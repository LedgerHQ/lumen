import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Screens icon component for React Native.
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
 * import { Screens } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Screens />
 *
 * @example
 * // With custom size and style
 * <Screens size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Screens} size="md">
 *   Click me
 * </Button>
 */
export const Screens = createIcon(
  'Screens',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.332 1.998h5.336m-6.67 2.5h8.004m.233 9.505h-8.47a1.334 1.334 0 0 1-1.327-1.2l-.434-4.336A1.334 1.334 0 0 1 3.331 7h9.338a1.334 1.334 0 0 1 1.327 1.467l-.434 4.335a1.334 1.334 0 0 1-1.327 1.2'
    />
  </Svg>,
);
