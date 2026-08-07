import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Medal2 icon component for React Native.
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
 * import { Medal2 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Medal2 />
 *
 * @example
 * // With custom size and style
 * <Medal2 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Medal2} size="md">
 *   Click me
 * </Button>
 */
export const Medal2 = createIcon(
  'Medal2',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m4.08 9.2-2.087 2.133 1.667 1 1 1.667 2.593-2.733m1.48.003 2.594 2.727 1-1.667 1.666-1-2.086-2.133m-.614-5.83a4.663 4.663 0 1 1-6.6 6.593 4.665 4.665 0 0 1-.006-6.6 4.65 4.65 0 0 1 6.593 0M7.993 8.39l1.194.626c.233.12.5-.08.46-.34l-.234-1.34.967-.947a.323.323 0 0 0-.18-.546l-1.34-.2-.6-1.22a.318.318 0 0 0-.573 0l-.6 1.213-1.34.193a.317.317 0 0 0-.18.54l.966.94L6.3 8.643a.316.316 0 0 0 .46.333l1.193-.633h-.006z'
    />
  </Svg>,
);
