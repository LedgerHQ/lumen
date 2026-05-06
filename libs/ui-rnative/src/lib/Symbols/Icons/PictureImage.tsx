import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * PictureImage icon component for React Native.
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
 * import { PictureImage } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <PictureImage />
 *
 * @example
 * // With custom size and style
 * <PictureImage size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={PictureImage} size="md">
 *   Click me
 * </Button>
 */
export const PictureImage = createIcon(
  'PictureImage',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m1.998 8.667.863-.864a1.61 1.61 0 0 1 2.274 0L8 10.668m-3.333 3.335 4.199-4.199a1.61 1.61 0 0 1 2.274 0l2.627 2.627m.236-1.096a2.67 2.67 0 0 1-2.668 2.668h-6.67a2.67 2.67 0 0 1-2.667-2.668v-6.67a2.67 2.67 0 0 1 2.667-2.667h6.67a2.67 2.67 0 0 1 2.668 2.667z'
    />
  </Svg>,
);
