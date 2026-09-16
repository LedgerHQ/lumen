import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * DollarConvert icon component for React Native.
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
 * import { DollarConvert } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <DollarConvert />
 *
 * @example
 * // With custom size and style
 * <DollarConvert size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={DollarConvert} size="md">
 *   Click me
 * </Button>
 */
export const DollarConvert = createIcon(
  'DollarConvert',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.913 3.913A5.76 5.76 0 0 1 8 2.22a5.784 5.784 0 0 1 5.781 5.779c0 .44-.06.873-.153 1.293m-.895-.89 1.04 1.04 1.04-1.047m-2.726 3.69a5.8 5.8 0 0 1-4.094 1.687A5.784 5.784 0 0 1 2.36 6.693m.903.906L2.215 6.552 1.17 7.592m6.85-3.489v.974m0 6.82v-.974M9.952 6.44a1.457 1.457 0 0 0-1.451-1.364H7.433c-.756 0-1.372.608-1.372 1.364 0 .624.427 1.17 1.03 1.325l1.825.452a1.35 1.35 0 0 1 1.029 1.325c0 .756-.616 1.364-1.372 1.364H7.506c-.78 0-1.403-.608-1.458-1.372'
    />
  </Svg>,
);
