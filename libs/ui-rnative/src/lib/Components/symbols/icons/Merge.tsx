import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Merge icon component for React Native.
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
 * import { Merge } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Merge />
 *
 * @example
 * // With custom size and style
 * <Merge size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Merge} size="md">
 *   Click me
 * </Button>
 */
export const Merge = createIcon(
  'Merge',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4.332 5.332a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334m0 0v5.336m7.336-5.336a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334m0 0V6a1.667 1.667 0 0 1-1.667 1.668H5.999c-.92 0-1.667.746-1.667 1.667v1.334m0 0a1.667 1.667 0 1 0 0 3.334 1.667 1.667 0 0 0 0-3.334'
    />
  </Svg>,
);
