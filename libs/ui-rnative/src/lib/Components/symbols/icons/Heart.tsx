import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Heart icon component for React Native.
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
 * import { Heart } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Heart />
 *
 * @example
 * // With custom size and style
 * <Heart size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Heart} size="md">
 *   Click me
 * </Button>
 */
export const Heart = createIcon(
  'Heart',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.467 2.667C12.58 2.667 14 4.653 14 6.507c0 3.753-5.893 6.826-6 6.826S2 10.26 2 6.507c0-1.854 1.42-3.84 3.533-3.84 1.214 0 2.007.606 2.467 1.14.46-.534 1.253-1.14 2.467-1.14'
    />
  </Svg>,
);
