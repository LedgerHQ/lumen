import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Nfc icon component for React Native.
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
 * import { Nfc } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Nfc />
 *
 * @example
 * // With custom size and style
 * <Nfc size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Nfc} size="md">
 *   Click me
 * </Button>
 */
export const Nfc = createIcon(
  'Nfc',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6 4.827a2.83 2.83 0 0 1 4 0m-6.244 6.75a6.003 6.003 0 1 1 8.488 0M7 6.414a1.415 1.415 0 0 1 2 0M7.5 13.17h1m-1.634 1.5h2.268a1.2 1.2 0 0 0 1.2-1.2V9.867a1.2 1.2 0 0 0-1.2-1.2H6.866a1.2 1.2 0 0 0-1.2 1.2v3.602a1.2 1.2 0 0 0 1.2 1.2'
    />
  </Svg>,
);
