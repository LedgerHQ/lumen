import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * UserCircle icon component for React Native.
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
 * import { UserCircle } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <UserCircle />
 *
 * @example
 * // With custom size and style
 * <UserCircle size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={UserCircle} size="md">
 *   Click me
 * </Button>
 */
export const UserCircle = createIcon(
  'UserCircle',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4 12a6.66 6.66 0 0 1 8 0M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2m0 2.667a2 2 0 1 0 0 4 2 2 0 0 0 0-4'
    />
  </Svg>,
);
