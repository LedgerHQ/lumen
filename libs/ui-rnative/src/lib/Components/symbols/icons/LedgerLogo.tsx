import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * LedgerLogo icon component for React Native.
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
 * import { LedgerLogo } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <LedgerLogo />
 *
 * @example
 * // With custom size and style
 * <LedgerLogo size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={LedgerLogo} size="md">
 *   Click me
 * </Button>
 */
export const LedgerLogo = createIcon(
  'LedgerLogo',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2 4.667V3a1 1 0 0 1 1-1h3m3.333 8H7.667a1 1 0 0 1-1-1V6M14 4.667V3a1 1 0 0 0-1-1h-3m-8 9.333V13a1 1 0 0 0 1 1h3m8-2.667V13a1 1 0 0 1-1 1h-3'
    />
  </Svg>,
);
