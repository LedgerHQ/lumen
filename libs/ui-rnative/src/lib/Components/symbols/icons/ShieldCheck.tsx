import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * ShieldCheck icon component for React Native.
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
 * import { ShieldCheck } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ShieldCheck />
 *
 * @example
 * // With custom size and style
 * <ShieldCheck size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ShieldCheck} size="md">
 *   Click me
 * </Button>
 */
export const ShieldCheck = createIcon(
  'ShieldCheck',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m10.167 6.75-2.5 2.5-1.5-1.5m7.166-.295c0 3.027-2.28 5.858-5.333 6.545-3.058-.693-5.333-3.52-5.333-6.545V5.077c0-.547.326-1.034.826-1.24L6.827 2.47a3.03 3.03 0 0 1 2.34 0L12.5 3.83c.5.2.827.687.827 1.233v2.378z'
    />
  </Svg>,
);
