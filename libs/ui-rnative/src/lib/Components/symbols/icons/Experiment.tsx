import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Experiment icon component for React Native.
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
 * import { Experiment } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Experiment />
 *
 * @example
 * // With custom size and style
 * <Experiment size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Experiment} size="md">
 *   Click me
 * </Button>
 */
export const Experiment = createIcon(
  'Experiment',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.333 4v2.78c0 .353.14.687.387.94l3.213 3.213c.25.25.387.587.387.94v.78c0 .734-.6 1.334-1.333 1.334h-8c-.74 0-1.334-.6-1.334-1.334v-.786c0-.354.14-.694.387-.947L6.253 7.7c.25-.25.387-.593.387-.947V3.967M9.333 4C9.7 4 10 3.7 10 3.333v-.666C10 2.293 9.7 2 9.333 2H6.667A.664.664 0 0 0 6 2.667v.666C6 3.7 6.293 4 6.667 4zm-6.546 7.333h10.426m-6.666-4h2.906'
    />
  </Svg>,
);
