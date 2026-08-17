import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Pin icon component for React Native.
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
 * import { Pin } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Pin />
 *
 * @example
 * // With custom size and style
 * <Pin size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Pin} size="md">
 *   Click me
 * </Button>
 */
export const Pin = createIcon(
  'Pin',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 13.333V10m-3.34 0h6.68a.66.66 0 0 0 .383-1.197l-2.056-1.47v-2l1.703-1.135a.67.67 0 0 0 .297-.555v-.31A.667.667 0 0 0 11 2.667H5a.667.667 0 0 0-.667.666v.31c0 .223.112.432.297.555l1.703 1.135v2l-2.056 1.47A.66.66 0 0 0 4.66 10'
    />
  </Svg>,
);
