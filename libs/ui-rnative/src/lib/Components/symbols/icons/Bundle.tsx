import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Bundle icon component for React Native.
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
 * import { Bundle } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Bundle />
 *
 * @example
 * // With custom size and style
 * <Bundle size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Bundle} size="md">
 *   Click me
 * </Button>
 */
export const Bundle = createIcon(
  'Bundle',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeWidth={1.3}
      d='M9.6 3.2h.8a.8.8 0 0 1 .8.8v8a.8.8 0 0 1-.8.8h-.8m3.6-9.6h.8a.8.8 0 0 1 .8.8v8a.8.8 0 0 1-.8.8h-.8m-10.8 0h4.4a.8.8 0 0 0 .8-.8V4a.8.8 0 0 0-.8-.8H2.4a.8.8 0 0 0-.8.8v8a.8.8 0 0 0 .8.8Z'
    />
  </Svg>,
);
