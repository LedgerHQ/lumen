import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Minimize icon component for React Native.
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
 * import { Minimize } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Minimize />
 *
 * @example
 * // With custom size and style
 * <Minimize size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Minimize} size="md">
 *   Click me
 * </Button>
 */
export const Minimize = createIcon(
  'Minimize',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.167 13.833V11.5c0-.737.596-1.333 1.333-1.333h2.333m-8-8V4.5c0 .737-.596 1.333-1.333 1.333H2.167m11.666 0H11.5A1.333 1.333 0 0 1 10.167 4.5V2.167m-8 8H4.5c.737 0 1.333.596 1.333 1.333v2.333'
    />
  </Svg>,
);
