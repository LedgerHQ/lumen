import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * UserShield icon component for React Native.
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
 * import { UserShield } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <UserShield />
 *
 * @example
 * // With custom size and style
 * <UserShield size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={UserShield} size="md">
 *   Click me
 * </Button>
 */
export const UserShield = createIcon(
  'UserShield',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M7.562 10.667c-1.433 0-2.8.566-3.807 1.573M14 8c0-3.32-2.687-6-6-6-3.32 0-6 2.68-6 6 0 3.313 2.68 6 6 6m2-3.033v.56a2.48 2.48 0 0 0 1.62 2.34l.286.106q.081.03.173 0l.287-.113a2.51 2.51 0 0 0 1.62-2.347v-.566a.51.51 0 0 0-.353-.48l-1.5-.474a.46.46 0 0 0-.3 0l-1.5.467a.486.486 0 0 0-.354.473zM10 6.5v.333c0 1.1-.9 2-2 2-1.107 0-2-.9-2-2V6.5c0-1.107.893-2 2-2 1.1 0 2 .893 2 2'
    />
  </Svg>,
);
