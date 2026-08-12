import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Repair icon component for React Native.
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
 * import { Repair } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Repair />
 *
 * @example
 * // With custom size and style
 * <Repair size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Repair} size="md">
 *   Click me
 * </Button>
 */
export const Repair = createIcon(
  'Repair',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m7.507 6.401-5.08 5.074a1.475 1.475 0 0 0-.007 2.086h0a1.48 1.48 0 0 0 2.086 0l5.073-5.08v0a3.32 3.32 0 0 0 4.207-2.067l.02-.08v0c.14-.434.187-.887.147-1.334a.673.673 0 0 0-.754-.573.64.64 0 0 0-.386.186l-1.207 1.2a.34.34 0 0 1-.473 0l-.007-.006-1.02-1.02c-.133-.134-.133-.347.12-.6l1.073-1.08c.26-.26.26-.68.007-.947a.67.67 0 0 0-.387-.193 3.1 3.1 0 0 0-1.333.146v-.006A3.31 3.31 0 0 0 7.413 6.26l.02.073z'
    />
  </Svg>,
);
