import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * ExpandRight icon component for React Native.
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
 * import { ExpandRight } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ExpandRight />
 *
 * @example
 * // With custom size and style
 * <ExpandRight size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ExpandRight} size="md">
 *   Click me
 * </Button>
 */
export const ExpandRight = createIcon(
  'ExpandRight',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.667 9.333 11 8 9.667 6.667M8.667 2h2A3.333 3.333 0 0 1 14 5.333v5.334A3.333 3.333 0 0 1 10.667 14h-2m-2 0V2H5.333A3.333 3.333 0 0 0 2 5.333v5.334A3.333 3.333 0 0 0 5.333 14z'
    />
  </Svg>,
);
