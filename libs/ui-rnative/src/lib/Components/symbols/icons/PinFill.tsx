import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * PinFill icon component for React Native.
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
 * import { PinFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <PinFill />
 *
 * @example
 * // With custom size and style
 * <PinFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={PinFill} size="md">
 *   Click me
 * </Button>
 */
export const PinFill = createIcon(
  'PinFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M12.316 3.643c0 .44-.22.85-.585 1.095l-1.415.943v1.317l1.785 1.275.123.1a1.31 1.31 0 0 1-.884 2.277H8.65v2.684a.65.65 0 0 1-1.3 0V10.65H4.66a1.31 1.31 0 0 1-.76-2.377l1.784-1.275V5.68L4.27 4.74a1.32 1.32 0 0 1-.586-1.096v-.31c0-.726.589-1.317 1.316-1.317h6c.727 0 1.316.59 1.316 1.318z'
    />
  </Svg>,
);
