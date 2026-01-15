import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * BellFill icon component for React Native.
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
 * import { BellFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <BellFill />
 *
 * @example
 * // With custom size and style
 * <BellFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={BellFill} size="md">
 *   Click me
 * </Button>
 */
export const BellFill = createIcon(
  'BellFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M10.353 13.379A2.65 2.65 0 0 1 8 14.816a2.65 2.65 0 0 1-2.354-1.437zM7.987 1.664a4.65 4.65 0 0 1 4.65 4.647l.011 2.585.945.945.086.095c.187.228.296.522.298.824v.007l-.001.006a1.32 1.32 0 0 1-1.316 1.304h-2.01v.002h-5.3v-.002H3.328A1.316 1.316 0 0 1 2.01 10.76c0-.346.13-.68.384-.933l.943-.95V6.314a4.645 4.645 0 0 1 4.65-4.649'
    />
  </Svg>,
);
