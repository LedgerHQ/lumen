import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Bank icon component for React Native.
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
 * import { Bank } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Bank />
 *
 * @example
 * // With custom size and style
 * <Bank size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Bank} size="md">
 *   Click me
 * </Button>
 */
export const Bank = createIcon(
  'Bank',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.762 6.667V12m2.905 0V6.667m-9.334 0V12m2.905 0V6.667m7.762 0H2V4.663L8.101 2 14 4.574zM2 14h12v-.667L13.333 12H2.667L2 13.333z'
    />
  </Svg>,
);
