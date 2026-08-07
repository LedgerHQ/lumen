import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Nano icon component for React Native.
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
 * import { Nano } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Nano />
 *
 * @example
 * // With custom size and style
 * <Nano size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Nano} size="md">
 *   Click me
 * </Button>
 */
export const Nano = createIcon(
  'Nano',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.333 11.944a.279.279 0 0 0 .556 0 .28.28 0 0 0-.278-.277.28.28 0 0 0-.278.283M6.172 8 3.236 5.064a.333.333 0 0 1 0-.471l2.357-2.357c.13-.13.341-.13.471 0L11.83 8m-9.536 6H12a2 2 0 1 0 0-4H2.293a.293.293 0 0 0-.293.293v3.414c0 .162.131.293.293.293'
    />
  </Svg>,
);
