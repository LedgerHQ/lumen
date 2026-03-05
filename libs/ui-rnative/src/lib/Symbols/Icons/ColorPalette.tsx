import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * ColorPalette icon component for React Native.
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
 * import { ColorPalette } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ColorPalette />
 *
 * @example
 * // With custom size and style
 * <ColorPalette size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ColorPalette} size="md">
 *   Click me
 * </Button>
 */
export const ColorPalette = createIcon(
  'ColorPalette',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.148 5.285a1.334 1.334 0 0 1 1.569.594l1.103 1.885a1.334 1.334 0 0 1-.49 1.832l-6.705 3.822a4.46 4.46 0 0 1-2.21.585m-.083 0a2.334 2.334 0 0 0 2.334-2.335V3.331c0-.736-.597-1.333-1.334-1.333h-2c-.737 0-1.334.597-1.334 1.333v8.337a2.334 2.334 0 0 0 2.334 2.335m0 0a3.13 3.13 0 0 0 2.703-1.55l3.969-6.786a1.334 1.334 0 0 0-.491-1.832L8.588 2.738a1.334 1.334 0 0 0-1.812.485l-.11.187M4.5 11.668a.167.167 0 1 1-.334 0 .167.167 0 0 1 .334 0'
    />
  </Svg>,
);
