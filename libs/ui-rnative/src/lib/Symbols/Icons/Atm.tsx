import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Atm icon component for React Native.
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
 * import { Atm } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Atm />
 *
 * @example
 * // With custom size and style
 * <Atm size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Atm} size="md">
 *   Click me
 * </Button>
 */
export const Atm = createIcon(
  'Atm',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4.665 9.176H3.331a1.334 1.334 0 0 1-1.333-1.334V3.841c0-.737.597-1.334 1.333-1.334h9.338c.736 0 1.334.597 1.334 1.334v4.001c0 .737-.598 1.334-1.334 1.334h-1.334M7 11.878h2m2.335-6.036h-6.67v7.02a.98.98 0 0 0 .983.983h4.704a.98.98 0 0 0 .983-.982zM7 8.875a1 1 0 1 1 2 0 1 1 0 0 1-2 0'
    />
  </Svg>,
);
