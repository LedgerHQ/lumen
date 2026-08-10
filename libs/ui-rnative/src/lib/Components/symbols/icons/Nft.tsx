import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Nft icon component for React Native.
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
 * import { Nft } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Nft />
 *
 * @example
 * // With custom size and style
 * <Nft size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Nft} size="md">
 *   Click me
 * </Button>
 */
export const Nft = createIcon(
  'Nft',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4.333 9.667V6.333L6 9.667V6.333m1.667 3.334V6.333H9m2 3.334V6.333m0 0h-.667m.667 0h.667M8 8h.333m5.167 2.47V5.53c0-.437-.233-.84-.611-1.059L8.61 2.001a1.22 1.22 0 0 0-1.222 0L3.11 4.472A1.22 1.22 0 0 0 2.5 5.53v4.94c0 .436.233.84.611 1.058l4.278 2.47c.378.218.844.218 1.222 0l4.278-2.47c.378-.218.611-.621.611-1.058'
    />
  </Svg>,
);
