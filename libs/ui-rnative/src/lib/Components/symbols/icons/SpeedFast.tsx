import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * SpeedFast icon component for React Native.
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
 * import { SpeedFast } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <SpeedFast />
 *
 * @example
 * // With custom size and style
 * <SpeedFast size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={SpeedFast} size="md">
 *   Click me
 * </Button>
 */
export const SpeedFast = createIcon(
  'SpeedFast',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m8.94 7.727 3.393-3.394m1.12 1.874a5.95 5.95 0 0 1-1.693 7.12m-1.307-10.12a5.9 5.9 0 0 0-2.46-.547h0c-3.314-.007-6 2.68-6.007 5.993a5.99 5.99 0 0 0 2.227 4.666M8 7.327a1.333 1.333 0 1 0 0 2.666 1.333 1.333 0 0 0 0-2.666'
    />
  </Svg>,
);
