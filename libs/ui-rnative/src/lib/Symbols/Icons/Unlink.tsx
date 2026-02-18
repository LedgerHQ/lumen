import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Unlink icon component for React Native.
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
 * import { Unlink } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Unlink />
 *
 * @example
 * // With custom size and style
 * <Unlink size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Unlink} size="md">
 *   Click me
 * </Button>
 */
export const Unlink = createIcon(
  'Unlink',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m11.403 8.36 1.458-1.458a2.75 2.75 0 0 0-3.889-3.89L7.514 4.472M5.5 10.374l1.25-1.25m2.5-2.5 1.25-1.25m2.187 7.187L3.313 3.187m1.284 4.201L3.139 8.846a2.75 2.75 0 1 0 3.889 3.89l1.458-1.459'
    />
  </Svg>,
);
