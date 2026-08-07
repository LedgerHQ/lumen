import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * PlaceholderCicleFill icon component for React Native.
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
 * import { PlaceholderCicleFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <PlaceholderCicleFill />
 *
 * @example
 * // With custom size and style
 * <PlaceholderCicleFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={PlaceholderCicleFill} size="md">
 *   Click me
 * </Button>
 */
export const PlaceholderCicleFill = createIcon(
  'PlaceholderCicleFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M8 1.6A6.4 6.4 0 1 1 8 14.4 6.4 6.4 0 0 1 8 1.6M4.15 4.15v7.7h7.7v-7.7zm5.481 6.4H6.37L8 8.92zM7.081 8 5.45 9.63V6.37zm3.47 1.63L8.918 8l1.631-1.63zm-.92-4.18L7.998 7.08 6.37 5.45z'
    />
  </Svg>,
);
