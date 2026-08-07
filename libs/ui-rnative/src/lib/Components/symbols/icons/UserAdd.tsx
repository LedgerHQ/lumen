import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * UserAdd icon component for React Native.
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
 * import { UserAdd } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <UserAdd />
 *
 * @example
 * // With custom size and style
 * <UserAdd size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={UserAdd} size="md">
 *   Click me
 * </Button>
 */
export const UserAdd = createIcon(
  'UserAdd',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M12 11.833h-1.667m.834-.833v1.667M6.667 10h-2A2.666 2.666 0 0 0 2 12.667v.666M11.167 9a2.833 2.833 0 1 0 0 5.667 2.833 2.833 0 0 0 0-5.667M7.333 2a2.667 2.667 0 1 0 0 5.333 2.667 2.667 0 0 0 0-5.333'
    />
  </Svg>,
);
