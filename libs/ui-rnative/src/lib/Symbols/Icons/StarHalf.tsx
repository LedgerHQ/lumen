import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * StarHalf icon component for React Native.
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
 * import { StarHalf } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <StarHalf />
 *
 * @example
 * // With custom size and style
 * <StarHalf size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={StarHalf} size="md">
 *   Click me
 * </Button>
 */
export const StarHalf = createIcon(
  'StarHalf',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M4.12 13.33 7.5 11.654l.051-8.758-1.439 2.837-4.12.52L4.92 9.25z'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m6.113 5.733 1.44-2.837-.052 8.758L4.12 13.33l.8-4.08-2.926-2.997zl1.88-3.753 1.88 3.747 4.12.513-2.927 2.987.8 4.08L8 11.49l-3.88 1.84'
    />
  </Svg>,
);
