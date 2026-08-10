import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Lock icon component for React Native.
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
 * import { Lock } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Lock />
 *
 * @example
 * // With custom size and style
 * <Lock size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Lock} size="md">
 *   Click me
 * </Button>
 */
export const Lock = createIcon(
  'Lock',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.333 6.667v-2a2.666 2.666 0 1 1 5.334 0v2M11.333 14H4.667c-.74 0-1.334-.6-1.334-1.333V8c0-.74.594-1.333 1.334-1.333h6.666c.734 0 1.334.593 1.334 1.333v4.667c0 .733-.6 1.333-1.334 1.333'
    />
  </Svg>,
);
