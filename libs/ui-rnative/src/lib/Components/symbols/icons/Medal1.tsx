import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Medal1 icon component for React Native.
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
 * import { Medal1 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Medal1 />
 *
 * @example
 * // With custom size and style
 * <Medal1 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Medal1} size="md">
 *   Click me
 * </Button>
 */
export const Medal1 = createIcon(
  'Medal1',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4.667 9.333v4.66c0 .18.146.327.333.327a.4.4 0 0 0 .133-.033l2.86-1.307 2.86 1.3c.167.073.36 0 .44-.167.014-.046.027-.093.027-.14v-4.74M8 1.333a4.667 4.667 0 1 0 0 9.334 4.667 4.667 0 0 0 0-9.334'
    />
  </Svg>,
);
