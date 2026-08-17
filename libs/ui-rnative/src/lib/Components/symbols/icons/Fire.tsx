import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Fire icon component for React Native.
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
 * import { Fire } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Fire />
 *
 * @example
 * // With custom size and style
 * <Fire size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Fire} size="md">
 *   Click me
 * </Button>
 */
export const Fire = createIcon(
  'Fire',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m4.132 5.04 2.322-2.71 2.503 2.921 1.62-1.89 1.291 1.507a5.34 5.34 0 0 1 1.286 3.476v.171A5.154 5.154 0 0 1 8 13.67v0a5.154 5.154 0 0 1-5.154-5.154v0A5.34 5.34 0 0 1 4.132 5.04'
      clipRule='evenodd'
    />
  </Svg>,
);
