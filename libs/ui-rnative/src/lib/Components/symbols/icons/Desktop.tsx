import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Desktop icon component for React Native.
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
 * import { Desktop } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Desktop />
 *
 * @example
 * // With custom size and style
 * <Desktop size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Desktop} size="md">
 *   Click me
 * </Button>
 */
export const Desktop = createIcon(
  'Desktop',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.333 11.333 9.667 14m-3-2.667L6.333 14M4.8 14h6.4M14 9H2m10.667 2.333H3.333C2.597 11.333 2 10.733 2 10V3.333C2 2.597 2.597 2 3.333 2h9.334C13.4 2 14 2.597 14 3.333V10c0 .733-.6 1.333-1.333 1.333'
    />
  </Svg>,
);
