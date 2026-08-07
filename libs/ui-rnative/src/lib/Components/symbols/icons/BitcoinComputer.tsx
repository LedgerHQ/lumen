import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * BitcoinComputer icon component for React Native.
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
 * import { BitcoinComputer } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <BitcoinComputer />
 *
 * @example
 * // With custom size and style
 * <BitcoinComputer size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={BitcoinComputer} size="md">
 *   Click me
 * </Button>
 */
export const BitcoinComputer = createIcon(
  'BitcoinComputer',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.333 11.333 9.667 14m-3-2.667L6.333 14m-.906 0h5.146M6.707 6.653V4.847h1.82a.901.901 0 1 1-.006 1.802m-.673-2.316v.514m0 4.153v-.583m4.438 2.916H3.713c-.946 0-1.72-.773-1.72-1.72V3.707c0-.947.767-1.72 1.714-1.72h8.571c.947 0 1.713.766 1.713 1.713v5.9c0 .947-.773 1.713-1.72 1.713zM8.75 8.407H6.703V6.653h2.04c.48 0 .874.387.874.874 0 .48-.394.873-.88.873z'
    />
  </Svg>,
);
