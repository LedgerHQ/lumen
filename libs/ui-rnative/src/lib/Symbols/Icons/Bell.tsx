import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Bell icon component for React Native.
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
 * import { Bell } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Bell />
 *
 * @example
 * // With custom size and style
 * <Bell size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Bell} size="md">
 *   Click me
 * </Button>
 */
export const Bell = createIcon(
  'Bell',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6 11.427v.74c0 1.1.893 2 2 2 1.1 0 2-.9 2-2v-.727m2-2.273 1.133 1.133c.12.12.194.293.194.467v-.007c0 .367-.3.667-.667.667H3.327a.664.664 0 0 1-.667-.667.66.66 0 0 1 .193-.473l1.134-1.14V6.313c0-2.213 1.786-4 4-4 2.206 0 4 1.787 4 4z'
    />
  </Svg>,
);
