import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Experiment2 icon component for React Native.
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
 * import { Experiment2 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Experiment2 />
 *
 * @example
 * // With custom size and style
 * <Experiment2 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Experiment2} size="md">
 *   Click me
 * </Button>
 */
export const Experiment2 = createIcon(
  'Experiment2',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.667 6.82 9.18 2.333m3.74 3.734L5.94 13.04c-.827.82-2.167.82-2.994 0l-.007-.007a2.123 2.123 0 0 1-.007-2.993v-.007l6.973-6.98m-5.232 5.28h5.98'
    />
  </Svg>,
);
