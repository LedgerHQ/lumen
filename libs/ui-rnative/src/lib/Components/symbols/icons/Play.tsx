import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Play icon component for React Native.
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
 * import { Play } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Play />
 *
 * @example
 * // With custom size and style
 * <Play size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Play} size="md">
 *   Click me
 * </Button>
 */
export const Play = createIcon(
  'Play',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      d='M4.116 4.279a1.063 1.063 0 0 1 1.6-.919l6.378 3.72a1.063 1.063 0 0 1 .002 1.839l-6.38 3.721a1.065 1.065 0 0 1-1.6-.919z'
    />
  </Svg>,
);
