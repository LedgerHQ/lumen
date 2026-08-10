import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * CoinAlert icon component for React Native.
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
 * import { CoinAlert } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CoinAlert />
 *
 * @example
 * // With custom size and style
 * <CoinAlert size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CoinAlert} size="md">
 *   Click me
 * </Button>
 */
export const CoinAlert = createIcon(
  'CoinAlert',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.473 8.807a4.667 4.667 0 0 0-6.293-6.29M6.667 9.16v-1.7m-.001 3.573c-.047 0-.087.034-.087.08 0 .04.034.08.08.08.04 0 .08-.04.08-.086a.09.09 0 0 0-.086-.087M6.667 14A4.67 4.67 0 0 1 2 9.333a4.667 4.667 0 0 1 9.333 0A4.67 4.67 0 0 1 6.667 14'
    />
  </Svg>,
);
