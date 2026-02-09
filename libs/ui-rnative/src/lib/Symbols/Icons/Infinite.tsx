import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Infinite icon component for React Native.
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
 * import { Infinite } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Infinite />
 *
 * @example
 * // With custom size and style
 * <Infinite size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Infinite} size="md">
 *   Click me
 * </Button>
 */
export const Infinite = createIcon(
  'Infinite',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M7.25 9.251c-.596.787-1.62 2.002-3.302 2.002v-.002l-.006.002C2.452 11.255 1.243 9.797 1.243 8s1.209-3.255 2.7-3.253l.006.002v-.002c1.682 0 3.495 2.196 4.091 2.984L8.25 8l.197.269c.553.786 2.237 2.984 3.798 2.984v-.002l.006.002c1.384.002 2.506-1.456 2.506-3.253s-1.122-3.255-2.507-3.253l-.006.002v-.002c-1.561 0-2.44 1.214-2.993 2.002'
    />
  </Svg>,
);
