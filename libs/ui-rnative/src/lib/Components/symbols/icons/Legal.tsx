import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Legal icon component for React Native.
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
 * import { Legal } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Legal />
 *
 * @example
 * // With custom size and style
 * <Legal size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Legal} size="md">
 *   Click me
 * </Button>
 */
export const Legal = createIcon(
  'Legal',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6 14H3.333C2.593 14 2 13.4 2 12.667V3.333C2 2.593 2.593 2 3.333 2h8c.734 0 1.334.593 1.334 1.333V6m-8-.667h4M4.667 8H6m2.667 6H14m-4.667 0v-3.053m2 3.053v-3.053m2 3.053v-3.053m-4.666 0H14V9.753L11.333 8.66 8.667 9.747z'
    />
  </Svg>,
);
