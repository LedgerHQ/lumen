import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * CloudSync icon component for React Native.
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
 * import { CloudSync } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CloudSync />
 *
 * @example
 * // With custom size and style
 * <CloudSync size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CloudSync} size="md">
 *   Click me
 * </Button>
 */
export const CloudSync = createIcon(
  'CloudSync',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m8.454 11.57 1.334-1.333 1.333 1.333m-1.333-1.333v3.698m-2.48-1.333-1.333 1.333-1.333-1.333m1.333 1.333v-3.698m-2.787.756A3.33 3.33 0 0 1 1.327 8a3.32 3.32 0 0 1 2.879-3.293V4.7a3.98 3.98 0 0 1 3.78-2.713c2.207 0 4 1.786 4 4a2.67 2.67 0 0 1 2.667 2.666 2.67 2.67 0 0 1-1.391 2.34'
    />
  </Svg>,
);
