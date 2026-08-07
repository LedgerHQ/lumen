import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Globe icon component for React Native.
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
 * import { Globe } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Globe />
 *
 * @example
 * // With custom size and style
 * <Globe size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Globe} size="md">
 *   Click me
 * </Button>
 */
export const Globe = createIcon(
  'Globe',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.34 6h11.32M2.34 10h11.32M8 2.067c2.889 0 2.889 11.866 0 11.866S5.111 2.067 8 2.067M8 2c3.32 0 6 2.679 6 6 0 3.32-2.68 6-6 6-3.321 0-6-2.68-6-6 0-3.321 2.679-6 6-6'
    />
  </Svg>,
);
