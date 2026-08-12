import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Devices icon component for React Native.
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
 * import { Devices } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Devices />
 *
 * @example
 * // With custom size and style
 * <Devices size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Devices} size="md">
 *   Click me
 * </Button>
 */
export const Devices = createIcon(
  'Devices',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6.667 14H3.333C2.593 14 2 13.4 2 12.667V3.333C2 2.593 2.593 2 3.333 2H10c.733 0 1.333.593 1.333 1.333v1.334m-.666 7.66H12M12.8 14H9.867a1.2 1.2 0 0 1-1.2-1.2V7.867c0-.667.533-1.2 1.2-1.2H12.8c.66 0 1.2.533 1.2 1.2V12.8c0 .66-.54 1.2-1.2 1.2'
    />
  </Svg>,
);
