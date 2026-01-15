import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * ExpandLeft icon component for React Native.
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
 * import { ExpandLeft } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ExpandLeft />
 *
 * @example
 * // With custom size and style
 * <ExpandLeft size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ExpandLeft} size="md">
 *   Click me
 * </Button>
 */
export const ExpandLeft = createIcon(
  'ExpandLeft',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6.333 6.667 5 8l1.333 1.333m1 4.667h-2A3.333 3.333 0 0 1 2 10.667V5.333A3.333 3.333 0 0 1 5.333 2h2m2 0v12h1.334A3.333 3.333 0 0 0 14 10.667V5.333A3.333 3.333 0 0 0 10.667 2z'
    />
  </Svg>,
);
