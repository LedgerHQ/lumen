import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Range icon component for React Native.
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
 * import { Range } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Range />
 *
 * @example
 * // With custom size and style
 * <Range size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Range} size="md">
 *   Click me
 * </Button>
 */
export const Range = createIcon(
  'Range',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='m2.667 8-.46-.46-.46.46.46.459zm10.666 0 .46.459a.65.65 0 0 0 0-.92zm-3.126 2.207a.65.65 0 1 0 .92.92l-.46-.46zm.92-5.333a.65.65 0 1 0-.92.919l.46-.46zm-5.334.919a.65.65 0 0 0-.92-.92l.46.46zm-.92 5.333a.65.65 0 0 0 .92-.919l-.46.46zM2.668 8v.65h10.666v-1.3H2.667zm8 2.668.46.46 2.666-2.668-.46-.46-.46-.46-2.666 2.668zm2.666-2.668.46-.46-2.667-2.665-.46.46-.459.459 2.667 2.666zm-8-2.666-.46-.46L2.208 7.54l.46.46.46.459 2.666-2.666zM2.667 8l-.46.46 2.667 2.667.46-.46.459-.459L3.126 7.54z'
    />
  </Svg>,
);
