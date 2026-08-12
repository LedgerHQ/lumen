import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * WirelessCharging icon component for React Native.
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
 * import { WirelessCharging } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <WirelessCharging />
 *
 * @example
 * // With custom size and style
 * <WirelessCharging size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={WirelessCharging} size="md">
 *   Click me
 * </Button>
 */
export const WirelessCharging = createIcon(
  'WirelessCharging',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9 11.333v1.334c0 .366-.3.666-.667.666h-.666A.664.664 0 0 1 7 12.667v-1.334m1 3.334v-1.334M7.835 5l-.84 1.667h2l-.84 1.666M3.333 2h9.334C13.403 2 14 2.597 14 3.333V10c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 0 1 2 10V3.333C2 2.597 2.597 2 3.333 2'
    />
  </Svg>,
);
