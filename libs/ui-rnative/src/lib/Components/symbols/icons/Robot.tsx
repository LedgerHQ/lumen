import Svg, { Path, Circle } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Robot icon component for React Native.
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
 * import { Robot } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Robot />
 *
 * @example
 * // With custom size and style
 * <Robot size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Robot} size="md">
 *   Click me
 * </Button>
 */
export const Robot = createIcon(
  'Robot',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      d='M8 .789v3.208M.667 6.667v4m14.666-4v4M4 3.997h8c.736 0 1.333.597 1.333 1.333v6.667c0 .736-.597 1.333-1.333 1.333H4a1.333 1.333 0 0 1-1.333-1.333V5.33c0-.736.597-1.333 1.333-1.333ZM8.333 1.32a.333.333 0 1 1-.666 0 .333.333 0 0 1 .666 0Z'
    />
    <Circle cx={6} cy={8.667} r={0.983} fill='currentColor' />
    <Circle cx={10} cy={8.667} r={0.983} fill='currentColor' />
  </Svg>,
);
