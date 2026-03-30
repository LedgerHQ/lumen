import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * TriangleUp icon component for React Native.
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
 * import { TriangleUp } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <TriangleUp />
 *
 * @example
 * // With custom size and style
 * <TriangleUp size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={TriangleUp} size="md">
 *   Click me
 * </Button>
 */
export const TriangleUp = createIcon(
  'TriangleUp',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M13.038 11.512 8.82 4.798a1 1 0 0 0-1.696.004L2.95 11.516a1 1 0 0 0 .85 1.528h8.39a1 1 0 0 0 .848-1.532'
    />
  </Svg>,
);
