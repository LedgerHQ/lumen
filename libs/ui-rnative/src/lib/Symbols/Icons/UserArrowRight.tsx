import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * UserArrowRight icon component for React Native.
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
 * import { UserArrowRight } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <UserArrowRight />
 *
 * @example
 * // With custom size and style
 * <UserArrowRight size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={UserArrowRight} size="md">
 *   Click me
 * </Button>
 */
export const UserArrowRight = createIcon(
  'UserArrowRight',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.333 13.333A2.916 2.916 0 0 0 8.4 10.4H5a2.916 2.916 0 0 0-2.933 2.933M11.333 8h3.334m-1.334-1.333L14.667 8l-1.334 1.333M4.667 3.6C3.6 4.667 3.6 6.467 4.667 7.533 5.733 8.6 7.533 8.6 8.6 7.533s1.067-2.866 0-3.933-2.8-1.067-3.933 0'
    />
  </Svg>,
);
