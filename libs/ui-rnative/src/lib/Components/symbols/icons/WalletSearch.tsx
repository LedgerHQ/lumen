import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * WalletSearch icon component for React Native.
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
 * import { WalletSearch } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <WalletSearch />
 *
 * @example
 * // With custom size and style
 * <WalletSearch size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={WalletSearch} size="md">
 *   Click me
 * </Button>
 */
export const WalletSearch = createIcon(
  'WalletSearch',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m3.587 12.08-1.254 1.253m-.333-6v-3c0-.926.74-1.666 1.667-1.666h8c.92 0 1.666.74 1.666 1.666v2m0 0h-1c-.926 0-1.666.74-1.666 1.667 0 .92.74 1.667 1.666 1.667h1m0-3.334c.367 0 .667.294.667.667v2c0 .367-.3.667-.667.667m0 0v2c0 .92-.746 1.666-1.666 1.666h-3M5 8.667a2 2 0 1 0 0 4 2 2 0 0 0 0-4'
    />
  </Svg>,
);
