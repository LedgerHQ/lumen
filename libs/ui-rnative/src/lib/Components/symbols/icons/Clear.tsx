import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Clear icon component for React Native.
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
 * import { Clear } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Clear />
 *
 * @example
 * // With custom size and style
 * <Clear size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Clear} size="md">
 *   Click me
 * </Button>
 */
export const Clear = createIcon(
  'Clear',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.667 14.667v-1.334m4.666 1.334v-1.334M8 14.667v-1.334m3.173 1.334H4.82c-.74 0-1.34-.6-1.34-1.334-.007-.053 0-.1.007-.153l.233-2.147A2.656 2.656 0 0 1 6.367 8.66h3.226a2.67 2.67 0 0 1 2.654 2.372l.233 2.147a1.33 1.33 0 0 1-1.18 1.467c-.053 0-.107.006-.153.006zM8 1.333c.547 0 1 .447 1 1v4c0 .18-.153.334-.333.334H7.333A.334.334 0 0 1 7 6.333v-4c0-.553.447-1 1-1m1.5 7.334h-3A.67.67 0 0 1 5.827 8a.6.6 0 0 1 .046-.26l.274-.667c.1-.253.34-.413.613-.413H9.2a.66.66 0 0 1 .613.407l.274.666a.664.664 0 0 1-.36.867.7.7 0 0 1-.26.047z'
    />
  </Svg>,
);
