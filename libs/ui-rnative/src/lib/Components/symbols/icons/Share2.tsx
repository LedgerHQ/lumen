import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Share2 icon component for React Native.
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
 * import { Share2 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Share2 />
 *
 * @example
 * // With custom size and style
 * <Share2 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Share2} size="md">
 *   Click me
 * </Button>
 */
export const Share2 = createIcon(
  'Share2',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m6.027 7.207 3.946-1.974m-3.946 3.56 3.946 1.974M5.702 6.743a1.778 1.778 0 1 1-2.515 2.514 1.778 1.778 0 0 1 2.515-2.514m7.11-3.556a1.778 1.778 0 1 1-2.514 2.515 1.778 1.778 0 0 1 2.515-2.515m0 7.111a1.778 1.778 0 1 1-2.514 2.515 1.778 1.778 0 0 1 2.515-2.515'
    />
  </Svg>,
);
