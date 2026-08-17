import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * SubArrow icon component for React Native.
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
 * import { SubArrow } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <SubArrow />
 *
 * @example
 * // With custom size and style
 * <SubArrow size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={SubArrow} size="md">
 *   Click me
 * </Button>
 */
export const SubArrow = createIcon(
  'SubArrow',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.317 10.016H5.984c-1.833 0-3.333-1.465-3.333-3.257v.02-3.43m7.968 9.366 2.698-2.699-2.698-2.699'
    />
  </Svg>,
);
