import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Fingerprint icon component for React Native.
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
 * import { Fingerprint } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Fingerprint />
 *
 * @example
 * // With custom size and style
 * <Fingerprint size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Fingerprint} size="md">
 *   Click me
 * </Button>
 */
export const Fingerprint = createIcon(
  'Fingerprint',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.447 14.037A7.96 7.96 0 0 1 4 9.453a3.999 3.999 0 1 1 7.996 0m.217 3.989c-.072.004-.143.01-.215.01a4 4 0 0 1-3.998-4m.83 5.095a6 6 0 0 1-2.83-5.094 2 2 0 1 1 3.999 0 2 2 0 1 0 3.999 0 5.999 5.999 0 1 0-11.995 0c0 .738.083 1.458.235 2.151m11.343-7.622A7.42 7.42 0 0 0 8 1.452c-2.225 0-4.219.981-5.582 2.53'
    />
  </Svg>,
);
