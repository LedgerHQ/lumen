import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Paste icon component for React Native.
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
 * import { Paste } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Paste />
 *
 * @example
 * // With custom size and style
 * <Paste size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Paste} size="md">
 *   Click me
 * </Button>
 */
export const Paste = createIcon(
  'Paste',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8.333 8.333h3.334M8.333 10H10m-1.667 1.667h2.334M10 4v-.667C10 2.6 9.4 2 8.667 2H3.333C2.593 2 2 2.6 2 3.333v5.334C2 9.407 2.593 10 3.333 10H4m2-2.667v5.334C6 13.403 6.597 14 7.333 14h5.334c.736 0 1.333-.597 1.333-1.333V7.333C14 6.597 13.403 6 12.667 6H7.333C6.597 6 6 6.597 6 7.333'
    />
  </Svg>,
);
