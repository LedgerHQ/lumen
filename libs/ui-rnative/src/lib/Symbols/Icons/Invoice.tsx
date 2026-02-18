import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Invoice icon component for React Native.
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
 * import { Invoice } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Invoice />
 *
 * @example
 * // With custom size and style
 * <Invoice size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Invoice} size="md">
 *   Click me
 * </Button>
 */
export const Invoice = createIcon(
  'Invoice',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.667 6H5.333m5.334 2H5.333m3.334 2H5.333m7.633 3.597-.66.332a.67.67 0 0 1-.595.002l-1.048-.518-1.027.516a.67.67 0 0 1-.597 0L8 13.413l-1.04.518a.67.67 0 0 1-.596-.001l-1.027-.517-1.048.519a.67.67 0 0 1-.595-.002l-.66-.332a.67.67 0 0 1-.367-.595V2.998c0-.252.142-.482.367-.595l.66-.332a.67.67 0 0 1 .595-.002l1.048.518 1.027-.516a.67.67 0 0 1 .597 0L8 2.587l1.04-.518a.67.67 0 0 1 .596.001l1.027.516 1.048-.518a.67.67 0 0 1 .595.002l.66.332a.67.67 0 0 1 .367.595v10.004a.67.67 0 0 1-.367.595'
    />
  </Svg>,
);
