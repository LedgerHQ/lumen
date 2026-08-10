import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * GroupUsersAdd icon component for React Native.
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
 * import { GroupUsersAdd } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <GroupUsersAdd />
 *
 * @example
 * // With custom size and style
 * <GroupUsersAdd size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={GroupUsersAdd} size="md">
 *   Click me
 * </Button>
 */
export const GroupUsersAdd = createIcon(
  'GroupUsersAdd',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2 14a2.33 2.33 0 0 1 2.327-2.333H7a2.326 2.326 0 0 1 2.327 2.326m1.34-2.322h1a2.326 2.326 0 0 1 2.326 2.326M11.92 3h2.829m-1.414 1.414V1.586M5.667 5.67a2 2 0 1 0 0 4 2 2 0 0 0 0-4m5 1.333a1.333 1.333 0 1 0 0 2.667 1.333 1.333 0 0 0 0-2.667'
    />
  </Svg>,
);
