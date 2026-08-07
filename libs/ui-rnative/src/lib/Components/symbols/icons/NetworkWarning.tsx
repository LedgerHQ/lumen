import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * NetworkWarning icon component for React Native.
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
 * import { NetworkWarning } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <NetworkWarning />
 *
 * @example
 * // With custom size and style
 * <NetworkWarning size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={NetworkWarning} size="md">
 *   Click me
 * </Button>
 */
export const NetworkWarning = createIcon(
  'NetworkWarning',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.667 2h2.186c.627 0 1.14.507 1.14 1.14v2.187M5.333 14H3.14a1.147 1.147 0 0 1-1.147-1.147V10.66m9.307.287V9.72m0 2.573c-.033 0-.066.027-.06.06 0 .034.027.06.06.06.034 0 .06-.033.06-.066a.07.07 0 0 0-.066-.067m1.17-3.88 2.026 3.61c.493.886-.147 1.986-1.167 1.986H9.257a1.34 1.34 0 0 1-1.167-1.993l2.027-3.614a1.33 1.33 0 0 1 2.32 0zM3.44 3.357c-.813.106-1.441.8-1.441 1.643 0 .92.746 1.667 1.666 1.667h3.667a1.333 1.333 0 1 0 0-2.667 2 2 0 0 0-3.893-.643z'
    />
  </Svg>,
);
