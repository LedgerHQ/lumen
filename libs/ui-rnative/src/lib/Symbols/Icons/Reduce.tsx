import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Reduce icon component for React Native.
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
 * import { Reduce } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Reduce />
 *
 * @example
 * // With custom size and style
 * <Reduce size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Reduce} size="md">
 *   Click me
 * </Button>
 */
export const Reduce = createIcon(
  'Reduce',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M14.002 8v3.335a2.67 2.67 0 0 1-2.667 2.667h-6.67a2.67 2.67 0 0 1-2.668-2.667v-6.67a2.67 2.67 0 0 1 2.668-2.667H8m-.667 6.669 6.67-6.67m-6.67 6.67h2.668m-2.668 0V5.999'
    />
  </Svg>,
);
