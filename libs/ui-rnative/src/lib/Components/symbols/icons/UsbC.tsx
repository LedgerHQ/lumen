import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * UsbC icon component for React Native.
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
 * import { UsbC } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <UsbC />
 *
 * @example
 * // With custom size and style
 * <UsbC size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={UsbC} size="md">
 *   Click me
 * </Button>
 */
export const UsbC = createIcon(
  'UsbC',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6.667 12.667v2M5.333 6V2.667A.66.66 0 0 1 6 2h4c.367 0 .667.293.667.667V6m-1.334 6.667v2M5 6h6c.547 0 1 .447 1 1v3.667c0 1.1-.9 2-2 2H6c-1.107 0-2-.9-2-2V7c0-.553.447-1 1-1'
    />
  </Svg>,
);
