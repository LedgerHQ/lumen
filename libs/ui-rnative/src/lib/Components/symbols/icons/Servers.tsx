import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Servers icon component for React Native.
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
 * import { Servers } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Servers />
 *
 * @example
 * // With custom size and style
 * <Servers size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Servers} size="md">
 *   Click me
 * </Button>
 */
export const Servers = createIcon(
  'Servers',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.333 8c0 .737-1.044 1.333-2.333 1.333S5.667 8.736 5.667 8m0-2c0 .737 1.044 1.333 2.333 1.333S10.333 6.737 10.333 6m0 0C10.334 5.263 9.288 4.667 8 4.667S5.667 5.264 5.667 6v4c0 .736 1.044 1.333 2.332 1.333 1.289 0 2.334-.596 2.334-1.333zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12'
    />
  </Svg>,
);
